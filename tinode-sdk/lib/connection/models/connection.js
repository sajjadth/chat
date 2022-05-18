"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const utilities_1 = require("../../utilities");
const rxjs_1 = require("rxjs");
/**
 * Connection base class
 */
class Connection {
    constructor(config, backoffSettings) {
        /**
         * Settings for exponential backoff
         */
        this.backoffSettings = {
            backOffBaseDelay: 2000,
            backOffJitter: 0.3,
            backOffMaxIteration: 10,
        };
        /**
         * Backoff timer timeout
         */
        this.boffTimer = null;
        /**
         * Backoff iteration counter
         */
        this.boffIteration = 0;
        /**
         *  Indicator if the socket was manually closed - don't autoReconnect if true.
         */
        this.boffClosed = false;
        /**
         * A callback to report logging events.
         */
        this.logger = null;
        /**
         * Will be emitted when connection opens
         */
        this.onOpen = new rxjs_1.Subject();
        /**
         * Will be emitted when a message is received
         */
        this.onMessage = new rxjs_1.Subject();
        /**
         * Will be emitted on connection disconnect
         */
        this.onDisconnect = new rxjs_1.Subject();
        /**
         * Will be emitted when connection tries to reconnect automatically
         */
        this.onAutoReconnectIteration = new rxjs_1.Subject();
        this.config = config;
        if (backoffSettings) {
            this.backoffSettings = backoffSettings;
        }
    }
    /**
     * Returns connection transport method
     */
    get transport() {
        return this.config.transport;
    }
    /**
     * Backoff implementation - reconnect after a timeout.
     */
    boffReconnect() {
        // Clear timer
        clearTimeout(this.boffTimer);
        // Calculate when to fire the reconnect attempt
        const jitterDelay = (1.0 + this.backoffSettings.backOffJitter * Math.random());
        const timeout = this.backoffSettings.backOffBaseDelay * (Math.pow(2, this.boffIteration) * jitterDelay);
        // Update iteration counter for future use
        if (this.boffIteration < this.backoffSettings.backOffMaxIteration) {
            this.boffIteration = this.boffIteration + 1;
        }
        this.onAutoReconnectIteration.next({ timeout });
        this.boffTimer = setTimeout(() => {
            utilities_1.Utilities.log('Reconnecting, iter=' + this.boffIteration + ', timeout=' + timeout);
            // Maybe the socket was closed while we waited for the timer?
            if (!this.boffClosed) {
                const prom = this.connect();
                this.onAutoReconnectIteration.next({ timeout: 0, promise: prom });
            }
            else {
                this.onAutoReconnectIteration.next({ timeout: -1 });
            }
        }, timeout);
    }
    /**
     * Terminate auto-reconnect process.
     */
    backoffStop() {
        clearTimeout(this.boffTimer);
        this.boffTimer = 0;
    }
    /**
     * Try to restore a network connection, also reset backoff.
     * @param force - reconnect even if there is a live connection already.
     */
    reconnect(force) {
        this.backoffStop();
        this.connect(null, force);
    }
    /**
     * Send a message to test
     */
    probe() {
        this.sendText('1');
    }
    /**
     * Check if the given network transport is available.
     * @param transport - either 'ws' (websocket) or 'lp' (long polling).
     */
    transportAvailable(transport) {
        switch (transport) {
            case 'ws':
                return utilities_1.NetworkProviders.WebSocket;
            case 'lp':
                return utilities_1.NetworkProviders.XMLHTTPRequest;
            default:
                console.log('Request for unknown transport', transport);
                return false;
        }
    }
    /**
     * Reset auto reconnect counter to zero.
     */
    backoffReset() {
        this.boffIteration = 0;
    }
}
exports.Connection = Connection;
