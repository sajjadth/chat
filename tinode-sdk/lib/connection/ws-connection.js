"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSConnection = void 0;
const utilities_1 = require("../utilities");
const constants_1 = require("../constants");
const models_1 = require("./models");
class WSConnection extends models_1.Connection {
    constructor(options) {
        super(options);
    }
    /**
     * Initiate a new connection
     * Returns Promise resolved/rejected when the connection call completes, resolution is called without parameters,
     * rejection passes the {Error} as parameter.
     * @param host - Host name to connect to; if null the old host name will be used.
     * @param force - Force new connection even if one already exists.
     */
    connect(host, force) {
        this.boffClosed = false;
        if (this.socket) {
            if (!force && this.socket.readyState === this.socket.OPEN) {
                return Promise.resolve();
            }
            this.socket.close();
            this.socket = null;
        }
        if (host) {
            this.config.host = host;
        }
        return new Promise((resolve, reject) => {
            const url = utilities_1.Utilities.makeBaseUrl(this.config.host, this.config.secure ? 'wss' : 'ws', this.config.APIKey);
            utilities_1.Utilities.log('Connecting to: ', url);
            const conn = new utilities_1.NetworkProviders.WebSocket(url);
            conn.onerror = (err) => {
                reject(err);
            };
            conn.onopen = (() => {
                if (this.config.autoReconnect) {
                    this.backoffStop();
                }
                this.onOpen.next();
                resolve(null);
            }).bind(this);
            conn.onclose = (() => {
                this.socket = null;
                const code = this.boffClosed ? constants_1.AppSettings.NETWORK_USER : constants_1.AppSettings.NETWORK_ERROR;
                const error = new Error(this.boffClosed ? constants_1.AppSettings.NETWORK_USER_TEXT : constants_1.AppSettings.ERROR_TEXT + ' (' + code + ')');
                this.onDisconnect.next({ error, code });
                if (!this.boffClosed && this.config.autoReconnect) {
                    this.boffReconnect();
                }
            }).bind(this);
            conn.onmessage = ((evt) => {
                console.log('sss');
                this.onMessage.next(evt.data);
            }).bind(this);
            this.socket = conn;
        });
    }
    /**
     * Disconnect this connection
     */
    disconnect() {
        this.boffClosed = true;
        if (!this.socket) {
            return;
        }
        this.backoffStop();
        this.socket.close();
        this.socket = null;
    }
    /**
     * Send a string to the server.
     * @param msg - String to send.
     */
    sendText(msg) {
        if (this.socket && (this.socket.readyState === this.socket.OPEN)) {
            this.socket.send(msg);
        }
        else {
            throw new Error('Websocket is not connected');
        }
    }
    /**
     * Check if current connection exists
     */
    isConnected() {
        return (this.socket && (this.socket.readyState === this.socket.OPEN));
    }
}
exports.WSConnection = WSConnection;
