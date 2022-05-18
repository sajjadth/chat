"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LPConnection = void 0;
const utilities_1 = require("../utilities");
const constants_1 = require("../constants");
const models_1 = require("./models");
class LPConnection extends models_1.Connection {
    constructor(options) {
        super(options);
        this.poller = null;
        this.sender = null;
        this.LP_URL = null;
    }
    /**
     * Initiate long polling connection connection
     * @param host - Host name to connect to; if null the old host name will be used.
     * @param force - Force new connection even if one already exists.
     */
    connect(host, force) {
        this.boffClosed = false;
        if (this.poller) {
            if (!force) {
                return Promise.resolve();
            }
            this.poller.onreadystatechange = undefined;
            this.poller.abort();
            this.poller = null;
        }
        if (host) {
            this.config.host = host;
        }
        return new Promise((resolve, reject) => {
            const url = utilities_1.Utilities.makeBaseUrl(this.config.host, this.config.secure ? 'https' : 'http', this.config.APIKey);
            utilities_1.Utilities.log('Connecting to: ', url);
            this.poller = this.LPPoller(url, resolve, reject);
            this.poller.send(null);
        }).catch((err) => {
            console.log('LP connection failed:', err);
        });
    }
    /**
     * Open http poller connection
     * @param url - Created base URL
     * @param resolve - promise resolve callback
     * @param reject - promise reject callback
     */
    LPPoller(url, resolve, reject) {
        let poller = new utilities_1.NetworkProviders.XMLHTTPRequest();
        let promiseCompleted = false;
        poller.onreadystatechange = (evt) => {
            if (poller.readyState === constants_1.XDRStatus.DONE) {
                if (poller.status === 201) { // 201 == HTTP.Created, get SID
                    const pkt = JSON.parse(poller.responseText, utilities_1.Utilities.jsonParseHelper);
                    this.LP_URL = url + '&sid=' + pkt.ctrl.params.sid;
                    poller = this.LPPoller(this.LP_URL);
                    poller.send(null);
                    this.onOpen.next();
                    if (resolve) {
                        promiseCompleted = true;
                        resolve();
                    }
                    if (this.config.autoReconnect) {
                        this.backoffStop();
                    }
                }
            }
            else if (poller.status < 400) { // 400 = HTTP.BadRequest
                this.onMessage.next(poller.responseText);
                this.poller = this.LPPoller(this.LP_URL);
                this.poller.send(null);
            }
            else {
                // Don't throw an error here, gracefully handle server errors
                if (reject && !promiseCompleted) {
                    promiseCompleted = true;
                    reject(poller.responseText);
                }
                if (poller.responseText) {
                    this.onMessage.next(poller.responseText);
                }
                const code = poller.status || (this.boffClosed ? constants_1.AppSettings.NETWORK_USER : constants_1.AppSettings.NETWORK_ERROR);
                const text = poller.responseText || (this.boffClosed ? constants_1.AppSettings.NETWORK_USER_TEXT : constants_1.AppSettings.ERROR_TEXT);
                this.onDisconnect.next({ error: new Error(text + ' (' + code + ')'), code });
                // Polling has stopped. Indicate it by setting poller to null.
                poller = null;
                if (!this.boffClosed && this.config.autoReconnect) {
                    this.boffReconnect();
                }
            }
        };
        console.log('url: ', url);
        poller.open('GET', url, true);
        return poller;
    }
    /**
     * Returns a http request to send data
     * @param url - Target URL
     */
    LPSender(url) {
        const sender = utilities_1.NetworkProviders.XMLHTTPRequest();
        sender.onreadystatechange = (evt) => {
            if (sender.readyState === constants_1.XDRStatus.DONE && sender.status >= 400) {
                // Some sort of error response
                throw new Error('LP sender failed, ' + sender.status);
            }
        };
        sender.open('POST', url, true);
        return sender;
    }
    /**
     * Disconnect this connection
     */
    disconnect() {
        this.boffClosed = true;
        this.backoffStop();
        if (this.sender) {
            this.sender.onreadystatechange = undefined;
            this.sender.abort();
            this.sender = null;
        }
        if (this.poller) {
            this.poller.onreadystatechange = undefined;
            this.poller.abort();
            this.poller = null;
        }
        const error = new Error(constants_1.AppSettings.NETWORK_USER_TEXT + ' (' + constants_1.AppSettings.NETWORK_USER + ')');
        this.onDisconnect.next({ error, code: constants_1.AppSettings.NETWORK_USER });
        // Ensure it's reconstructed
        this.LP_URL = null;
    }
    /**
     * Send a string to the server.
     * @param msg - String to send.
     */
    sendText(msg) {
        this.sender = this.LPSender(this.LP_URL);
        if (this.sender && (this.sender.readyState === this.sender.OPENED)) {
            this.sender.send(msg);
        }
        else {
            throw new Error('Long poller failed to connect');
        }
    }
    /**
     * Check if current connection exists
     */
    isConnected() {
        return (this.poller && true);
    }
}
exports.LPConnection = LPConnection;
