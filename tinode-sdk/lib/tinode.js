"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tinode = void 0;
const connection_1 = require("./connection");
const constants_1 = require("./constants");
const utilities_1 = require("./utilities");
const packet_1 = require("./packet");
const message_1 = require("./message");
const topic_1 = require("./topic/topic");
const topic_me_1 = require("./topic/topic-me");
const topic_fnd_1 = require("./topic/topic-fnd");
const rxjs_1 = require("rxjs");
const large_file_helper_1 = require("./large-file-helper");
class Tinode {
    constructor(appName, platform, connectionConfig) {
        /**
         * Client's platform
         */
        this.hardwareOS = 'Undefined';
        /**
         * Client's language
         */
        this.humanLanguage = 'en-US';
        /**
         * Specified platform by user
         */
        this.platform = 'Undefined';
        /**
         * Specified app name by user
         */
        this.appName = 'Undefined';
        /**
         * If this code is running on a browser, which one?
         */
        this.browser = '';
        /**
         * Logging to console enabled
         */
        this.loggingEnabled = false;
        /**
         * When logging, trip long strings (base64-encoded images) for readability
         */
        this.trimLongStrings = false;
        /**
         * UID of the currently authenticated user.
         */
        this.myUserID = null;
        /**
         * Status of connection: authenticated or not.
         */
        this.authenticated = false;
        /**
         * Login used in the last successful basic authentication
         */
        this.lastLogin = null;
        /**
         * Token which can be used for login instead of login/password.
         */
        this.authToken = null;
        /**
         * Counter of received packets
         */
        this.inPacketCount = 0;
        /**
         * Counter for generating unique message IDs
         */
        this.messageId = Math.floor((Math.random() * 0xFFFF) + 0xFFFF);
        /**
         * Information about the server, if connected
         */
        this.serverInfo = null;
        /**
         * Push notification token. Called deviceToken for consistency with the Android SDK.
         */
        this.deviceToken = null;
        /**
         * Cache of pending promises by message id.
         */
        this.pendingPromises = {};
        /**
         * A connection object
         */
        this.connection = null;
        /**
         * Tinode's cache of objects
         */
        this.cache = {};
        /**
         * Subject to report login completion.
         */
        this.onLogin = new rxjs_1.Subject();
        /**
         * Subject to receive server responses to network probes
         */
        this.onRawMessage = new rxjs_1.Subject();
        /**
         * Subject to receive server responses to network probes
         */
        this.onNetworkProbe = new rxjs_1.Subject();
        /**
         * Subject to receive all messages as objects.
         */
        this.onMessage = new rxjs_1.Subject();
        /**
         * Subject to receive {ctrl} (control) messages.
         */
        this.onCtrlMessage = new rxjs_1.Subject();
        /**
         * Subject to receive {meta} messages.
         */
        this.onMetaMessage = new rxjs_1.Subject();
        /**
         * Subject to receive {data} messages.
         */
        this.onDataMessage = new rxjs_1.Subject();
        /**
         * Subject to receive {pres} messages.
         */
        this.onPresMessage = new rxjs_1.Subject();
        /**
         * Subject to receive {info} messages.
         */
        this.onInfoMessage = new rxjs_1.Subject();
        /**
         * Subject for connect event
         */
        this.onConnect = new rxjs_1.Subject();
        /**
         * Subject for disconnect event
         */
        this.onDisconnect = new rxjs_1.Subject();
        /**
         * Wrapper for the reconnect iterator callback.
         */
        this.onAutoReconnectIteration = new rxjs_1.Subject();
        /**
         * Connection events subscriptions
         */
        this.connectionEventsSubscriptions = [];
        utilities_1.Utilities.initializeNetworkProviders();
        this.connectionConfig = connectionConfig;
        if (appName) {
            this.appName = appName;
        }
        if (platform) {
            this.platform = platform;
        }
        if (typeof navigator !== 'undefined') {
            this.browser = utilities_1.Utilities.getBrowserInfo(navigator.userAgent, navigator.product);
            this.hardwareOS = navigator.platform;
            this.humanLanguage = navigator.language || 'en-US';
        }
        switch (connectionConfig.transport) {
            case 'lp':
                this.connection = new connection_1.LPConnection(this.connectionConfig);
                break;
            case 'ws':
                this.connection = new connection_1.WSConnection(this.connectionConfig);
                break;
            default:
                throw new Error('Invalid transport method is selected! It can be "lp" or "ws"');
        }
        if (this.connection) {
            this.connection.logger = this.logger;
            this.doConnectionSubscriptions();
        }
        setInterval(() => {
            this.checkExpiredPromises();
        }, constants_1.AppSettings.EXPIRE_PROMISES_PERIOD);
    }
    /**
     * Return information about the current version of this Tinode client library.
     */
    static getVersion() {
        return constants_1.AppInfo.VERSION;
    }
    /**
     *  Return information about the current name and version of this Tinode library.
     */
    static getLibrary() {
        return constants_1.AppInfo.LIBRARY;
    }
    /**
     * To use Tinode in a non browser context, supply WebSocket and XMLHttpRequest providers.
     */
    static setNetworkProviders(ws, xmlhttprequest) {
        utilities_1.Utilities.initializeNetworkProviders(ws, xmlhttprequest);
    }
    /**
     * Subscribe and handle connection events
     */
    doConnectionSubscriptions() {
        const onMessageSubs = this.connection.onMessage.subscribe((data) => this.onConnectionMessage(data));
        this.connectionEventsSubscriptions.push(onMessageSubs);
        const onOpenSubs = this.connection.onOpen.subscribe(() => this.hello());
        this.connectionEventsSubscriptions.push(onOpenSubs);
        const onAutoReconnectSubs = this.connection.onAutoReconnectIteration.subscribe((data) => this.onAutoReconnectIteration.next(data));
        this.connectionEventsSubscriptions.push(onAutoReconnectSubs);
        const onDisconnectSubs = this.connection.onDisconnect.subscribe((data) => this.onConnectionDisconnect(data));
        this.connectionEventsSubscriptions.push(onDisconnectSubs);
    }
    /**
     * Toggle console logging. Logging is off by default.
     * @param enabled - Set to to enable logging to console.
     * @param trimLongStrings - Options to trim long strings
     */
    enableLogging(enabled, trimLongStrings) {
        this.loggingEnabled = enabled;
        this.trimLongStrings = enabled && trimLongStrings;
    }
    /**
     * Generator of packets stubs
     */
    initPacket(type, topicName) {
        switch (type) {
            case constants_1.PacketTypes.Hi:
                const hiData = {
                    ver: constants_1.AppInfo.VERSION,
                    ua: this.getUserAgent(),
                    dev: this.deviceToken,
                    lang: this.humanLanguage,
                    platf: this.platform,
                };
                return new packet_1.Packet(type, hiData, this.getNextUniqueId());
            case constants_1.PacketTypes.Acc:
                const accData = {
                    user: null,
                    scheme: null,
                    secret: null,
                    login: false,
                    tags: null,
                    desc: {},
                    cred: {},
                    token: null,
                };
                return new packet_1.Packet(type, accData, this.getNextUniqueId());
            case constants_1.PacketTypes.Login:
                const loginData = {
                    scheme: null,
                    secret: null,
                    cred: null,
                };
                return new packet_1.Packet(type, loginData, this.getNextUniqueId());
            case constants_1.PacketTypes.Sub:
                const subData = {
                    topic: topicName,
                    set: {},
                    get: {},
                };
                return new packet_1.Packet(type, subData, this.getNextUniqueId());
            case constants_1.PacketTypes.Leave:
                const leaveData = {
                    topic: topicName,
                    unsub: false,
                };
                return new packet_1.Packet(type, leaveData, this.getNextUniqueId());
            case constants_1.PacketTypes.Pub:
                const pubData = {
                    topic: topicName,
                    noecho: false,
                    head: null,
                    content: {},
                    from: null,
                    seq: null,
                    ts: null,
                };
                return new packet_1.Packet(type, pubData, this.getNextUniqueId());
            case constants_1.PacketTypes.Get:
                const getData = {
                    topic: topicName,
                    what: null,
                    desc: {},
                    sub: {},
                    data: {},
                };
                return new packet_1.Packet(type, getData, this.getNextUniqueId());
            case constants_1.PacketTypes.Set:
                const setData = {
                    topic: topicName,
                    desc: {},
                    sub: {},
                    tags: [],
                };
                return new packet_1.Packet(type, setData, this.getNextUniqueId());
            case constants_1.PacketTypes.Del:
                const delData = {
                    topic: topicName,
                    what: null,
                    delseq: null,
                    hard: false,
                    user: null,
                    cred: null,
                };
                return new packet_1.Packet(type, delData, this.getNextUniqueId());
            case constants_1.PacketTypes.Note:
                const noteData = {
                    topic: topicName,
                    seq: undefined,
                    what: null,
                };
                return new packet_1.Packet(type, noteData, null);
            default:
                throw new Error('Unknown packet type requested: ' + type);
        }
    }
    /**
     * Console logger
     * @param str - String to log
     * @param args - arguments
     */
    logger(str, ...args) {
        if (this.loggingEnabled) {
            const d = new Date();
            const dateString = ('0' + d.getUTCHours()).slice(-2) + ':' +
                ('0' + d.getUTCMinutes()).slice(-2) + ':' +
                ('0' + d.getUTCSeconds()).slice(-2) + '.' +
                ('00' + d.getUTCMilliseconds()).slice(-3);
            console.log('[' + dateString + ']', str, args.join(' '));
        }
    }
    /**
     * Put an object into cache
     * @param type - cache type
     * @param name - cache name
     * @param obj - cache object
     */
    cachePut(type, name, obj) {
        this.cache[type + ':' + name] = obj;
    }
    /**
     * Get an object from cache
     * @param type - cache type
     * @param name - cache name
     */
    cacheGet(type, name) {
        return this.cache[type + ':' + name];
    }
    /**
     * Delete an object from cache
     * @param type - cache type
     * @param name - cache name
     */
    cacheDel(type, name) {
        delete this.cache[type + ':' + name];
    }
    /**
     * Enumerate all items in cache, call func for each item.
     * Enumeration stops if func returns true.
     * @param func - function to call for each item
     * @param context - function context
     */
    cacheMap(func, context) {
        for (const idx in this.cache) {
            if (func(this.cache[idx], idx, context)) {
                break;
            }
        }
    }
    /**
     * Make limited cache management available to topic.
     * Caching user.public only. Everything else is per-topic.
     * @param topic - Topic to attach cache
     */
    attachCacheToTopic(topic) {
        topic.tinode = this;
        topic.cacheGetUser = (uid) => {
            const pub = this.cacheGet('user', uid);
            if (pub) {
                return {
                    user: uid,
                    public: utilities_1.Utilities.mergeObj({}, pub)
                };
            }
            return undefined;
        };
        topic.cachePutUser = (uid, user) => {
            return this.cachePut('user', uid, utilities_1.Utilities.mergeObj({}, user.public));
        };
        topic.cacheDelUser = (uid) => {
            return this.cacheDel('user', uid);
        };
        topic.cachePutSelf = () => {
            return this.cachePut('topic', topic.name, topic);
        };
        topic.cacheDelSelf = () => {
            return this.cacheDel('topic', topic.name);
        };
    }
    /**
     * Resolve or reject a pending promise.
     * Unresolved promises are stored in _pendingPromises.
     */
    execPromise(id, code, onOK, errorText) {
        const callbacks = this.pendingPromises[id];
        if (callbacks) {
            delete this.pendingPromises[id];
            if (code >= 200 && code < 400) {
                if (callbacks.resolve) {
                    callbacks.resolve(onOK);
                }
            }
            else if (callbacks.reject) {
                callbacks.reject(new Error(errorText + ' (' + code + ')'));
            }
        }
    }
    /**
     * Stored callbacks will be called when the response packet with this Id arrives
     * @param id - Id of new promise
     */
    makePromise(id) {
        let promise = null;
        if (id) {
            promise = new Promise((resolve, reject) => {
                this.pendingPromises[id] = {
                    resolve,
                    reject,
                    ts: new Date(),
                };
            });
        }
        return promise;
    }
    /**
     * Reject promises which have not been resolved for too long.
     */
    checkExpiredPromises() {
        const err = new Error('Timeout (504)');
        const expires = new Date(new Date().getTime() - constants_1.AppSettings.EXPIRE_PROMISES_TIMEOUT);
        for (const id in this.pendingPromises) {
            if (id) {
                const callbacks = this.pendingPromises[id];
                if (callbacks && callbacks.ts < expires) {
                    this.logger('Promise expired', id);
                    delete this.pendingPromises[id];
                    if (callbacks.reject) {
                        callbacks.reject(err);
                    }
                }
            }
        }
    }
    /**
     * Generates unique message IDs
     */
    getNextUniqueId() {
        return (this.messageId !== 0) ? '' + this.messageId++ : undefined;
    }
    /**
     * Get User Agent string
     */
    getUserAgent() {
        return this.appName + ' (' + (this.browser ? this.browser + '; ' : '') + this.hardwareOS + '); ' + constants_1.AppInfo.LIBRARY;
    }
    /**
     * Send a packet. If packet id is provided return a promise.
     * @param pkt - Packet
     * @param id - Message ID
     */
    send(pkt, id) {
        let promise;
        if (id) {
            promise = this.makePromise(id);
        }
        let formattedPkt = {};
        formattedPkt[pkt.name] = Object.assign(Object.assign({}, pkt.data), { id: pkt.id });
        formattedPkt = utilities_1.Utilities.simplify(formattedPkt);
        const msg = JSON.stringify(formattedPkt);
        this.logger('out: ' + (this.trimLongStrings ? JSON.stringify(formattedPkt, utilities_1.Utilities.jsonLoggerHelper) : msg));
        try {
            this.connection.sendText(msg);
        }
        catch (err) {
            // If sendText throws, wrap the error in a promise or rethrow.
            if (id) {
                this.execPromise(id, constants_1.AppSettings.NETWORK_ERROR, null, err.message);
            }
            else {
                throw err;
            }
        }
        return promise;
    }
    /**
     * REVIEW: types
     * On successful login save server-provided data.
     * @param ctrl - Server response
     */
    loginSuccessful(ctrl) {
        if (!ctrl.params || !ctrl.params.user) {
            return;
        }
        // This is a response to a successful login,
        // extract UID and security token, save it in Tinode module
        this.myUserID = ctrl.params.user;
        this.authenticated = (ctrl && ctrl.code >= 200 && ctrl.code < 300);
        if (ctrl.params && ctrl.params.token && ctrl.params.expires) {
            this.authToken = {
                token: ctrl.params.token,
                expires: new Date(ctrl.params.expires)
            };
        }
        else {
            this.authToken = null;
        }
        this.onLogin.next({ code: ctrl.code, text: ctrl.text });
    }
    /**
     * The main message dispatcher.
     * @param data - Server message data
     */
    onConnectionMessage(data) {
        // Skip empty response. This happens when LP times out.
        if (!data) {
            return;
        }
        this.inPacketCount++;
        // Send raw message to listener
        this.onRawMessage.next(data);
        if (data === '0') {
            // Server response to a network probe.
            this.onNetworkProbe.next();
            return;
        }
        const pkt = JSON.parse(data, utilities_1.Utilities.jsonParseHelper);
        if (!pkt) {
            this.logger('in: ' + data);
            this.logger('ERROR: failed to parse data');
            return;
        }
        this.logger('in: ' + (this.trimLongStrings ? JSON.stringify(pkt, utilities_1.Utilities.jsonLoggerHelper) : data));
        // Send complete packet to listener
        this.onMessage.next(pkt);
        switch (true) {
            case Boolean(pkt.ctrl):
                this.handleCtrlMessage(pkt);
                break;
            case Boolean(pkt.meta):
                this.handleMetaMessage(pkt);
                break;
            case Boolean(pkt.data):
                this.handleDataMessage(pkt);
                break;
            case Boolean(pkt.pres):
                this.handlePresMessage(pkt);
                break;
            case Boolean(pkt.info):
                this.handleInfoMessage(pkt);
                break;
            default: this.logger('ERROR: Unknown packet received.');
        }
    }
    /**
     * REVIEW: types
     * Handle ctrl type messages
     * @param pkt - Server message data
     */
    handleCtrlMessage(pkt) {
        this.onCtrlMessage.next(pkt.ctrl);
        // Resolve or reject a pending promise, if any
        if (pkt.ctrl.id) {
            this.execPromise(pkt.ctrl.id, pkt.ctrl.code, pkt.ctrl, pkt.ctrl.text);
        }
        if (pkt.ctrl.code === 205 && pkt.ctrl.text === 'evicted') {
            // User evicted from topic.
            const topic = this.cacheGet('topic', pkt.ctrl.topic);
            if (topic) {
                topic.resetSub();
            }
        }
        if (pkt.ctrl.params && pkt.ctrl.params.what === 'data') {
            // All messages received: "params":{"count":11,"what":"data"},
            const topic = this.cacheGet('topic', pkt.ctrl.topic);
            if (topic) {
                topic.allMessagesReceived(pkt.ctrl.params.count);
            }
        }
        if (pkt.ctrl.params && pkt.ctrl.params.what === 'sub') {
            // The topic has no subscriptions.
            const topic = this.cacheGet('topic', pkt.ctrl.topic);
            if (topic) {
                // Trigger topic.onSubsUpdated.
                topic.processMetaSub([]);
            }
        }
    }
    /**
     * REVIEW: types
     * Handle meta type messages
     * @param pkt - Server message data
     */
    handleMetaMessage(pkt) {
        this.onMetaMessage.next(pkt.meta);
        // Preferred API: Route meta to topic, if one is registered
        const topic = this.cacheGet('topic', pkt.meta.topic);
        if (topic) {
            topic.routeMeta(pkt.meta);
        }
        if (pkt.meta.id) {
            this.execPromise(pkt.meta.id, 200, pkt.meta, 'META');
        }
    }
    /**
     * REVIEW: types
     * Handle data type messages
     * @param pkt - Server message data
     */
    handleDataMessage(pkt) {
        this.onDataMessage.next(pkt.data);
        // Preferred API: Route data to topic, if one is registered
        const topic = this.cacheGet('topic', pkt.data.topic);
        if (topic) {
            topic.routeData(pkt.data);
        }
    }
    /**
     * REVIEW: types
     * Handle pres type messages
     * @param pkt - Server message data
     */
    handlePresMessage(pkt) {
        this.onPresMessage.next(pkt.pres);
        // Preferred API: Route presence to topic, if one is registered
        const topic = this.cacheGet('topic', pkt.pres.topic);
        if (topic) {
            topic.routePres(pkt.pres);
        }
    }
    /**
     * REVIEW: types
     * Handle info type messages
     * @param pkt - Server message data
     */
    handleInfoMessage(pkt) {
        this.onInfoMessage.next(pkt.info);
        // Preferred API: Route {info}} to topic, if one is registered
        const topic = this.cacheGet('topic', pkt.info.topic);
        if (topic) {
            topic.routeInfo(pkt.info);
        }
    }
    /**
     * Reset all variables and unsubscribe from all events and topics
     * @param onDisconnectData - Data from connection disconnect event
     */
    onConnectionDisconnect(onDisconnectData) {
        this.inPacketCount = 0;
        this.serverInfo = null;
        this.authenticated = false;
        // Mark all topics as unsubscribed
        this.cacheMap((obj, key) => {
            if (key.lastIndexOf('topic:', 0) === 0) {
                obj.resetSub();
            }
        });
        // Reject all pending promises
        for (const key in this.pendingPromises) {
            if (key) {
                const callbacks = this.pendingPromises[key];
                if (callbacks && callbacks.reject) {
                    callbacks.reject(onDisconnectData);
                }
            }
        }
        // Unsubscribe from connection events
        for (const subs of this.connectionEventsSubscriptions) {
            subs.unsubscribe();
        }
        this.connectionEventsSubscriptions = [];
        this.pendingPromises = {};
        this.onDisconnect.next(onDisconnectData);
    }
    /**
     * Connect to the server.
     * @param host - name of the host to connect to
     */
    connect(host) {
        if (!this.connectionEventsSubscriptions.length) {
            this.doConnectionSubscriptions();
        }
        return this.connection.connect(host);
    }
    /**
     * Attempt to reconnect to the server immediately.
     * @param force - reconnect even if there is a connection already.
     */
    reconnect(force) {
        return this.connection.connect(null, force);
    }
    /**
     * Disconnect from the server.
     */
    disconnect() {
        this.connection.disconnect();
    }
    /**
     * Check for live connection to server.
     */
    isConnected() {
        return this.connection.isConnected();
    }
    /**
     * Check if connection is authenticated (last login was successful).
     */
    isAuthenticated() {
        return this.authenticated;
    }
    /**
     * Send handshake to the server.
     */
    hello() {
        return __awaiter(this, void 0, void 0, function* () {
            const pkt = this.initPacket(constants_1.PacketTypes.Hi);
            try {
                const ctrl = yield this.send(pkt, pkt.id);
                // Reset backoff counter on successful connection.
                this.connection.backoffReset();
                // Server response contains server protocol version, build, constraints,
                // session ID for long polling. Save them.
                if (ctrl.params) {
                    this.serverInfo = ctrl.params;
                }
                this.onConnect.next();
                return ctrl;
            }
            catch (error) {
                this.connection.reconnect(true);
                this.onDisconnect.next(error);
                throw error;
            }
        });
    }
    /**
     * Create or update an account
     * @param userId - User id to update
     * @param scheme - Authentication scheme; "basic" and "anonymous" are the currently supported schemes.
     * @param secret - Authentication secret, assumed to be already base64 encoded.
     * @param login - Use new account to authenticate current session
     * @param params - User data to pass to the server.
     */
    account(userId, scheme, secret, login, params) {
        const pkt = this.initPacket(constants_1.PacketTypes.Acc);
        pkt.data.user = userId;
        pkt.data.scheme = scheme;
        pkt.data.secret = secret;
        pkt.data.login = login;
        if (params) {
            pkt.data.tags = params.tags;
            pkt.data.cred = params.cred;
            pkt.data.token = params.token;
            pkt.data.desc.defacs = params.defacs;
            pkt.data.desc.public = params.public;
            pkt.data.desc.private = params.private;
        }
        return this.send(pkt, pkt.id);
    }
    /**
     * Create a new user. Wrapper for `account`.
     * @param scheme - Authentication scheme; "basic" is the only currently supported scheme.
     * @param secret - Authentication secret
     * @param login - Use new account to authenticate current session
     * @param params - User data to pass to the server
     */
    createAccount(scheme, secret, login, params) {
        let promise = this.account(constants_1.TopicNames.USER_NEW, scheme, secret, login, params);
        if (login) {
            promise = promise.then((ctrl) => {
                this.loginSuccessful(ctrl);
                return ctrl;
            });
        }
        return promise;
    }
    /**
     * Create user with 'basic' authentication scheme and immediately
     * use it for authentication. Wrapper for `account`
     * @param username - Using this username you can log into your account
     * @param password - User's password
     * @param params - User data to pass to the server
     */
    createAccountBasic(username, password, login, params) {
        username = username || '';
        password = password || '';
        const secret = utilities_1.Utilities.base64encode(username + ':' + password);
        return this.createAccount(constants_1.AuthenticationScheme.Basic, secret, login, params);
    }
    /**
     * Update user's credentials for 'basic' authentication scheme. Wrapper for `account`
     * @param userId - User ID to update
     * @param username - Using this username you can log into your account
     * @param password - User's password
     * @param params - Data to pass to the server.
     */
    updateAccountBasic(userId, username, password, params) {
        // Make sure we are not using 'null' or 'undefined';
        username = username || '';
        password = password || '';
        return this.account(userId, constants_1.AuthenticationScheme.Basic, utilities_1.Utilities.base64encode(username + ':' + password), false, params);
    }
    /**
     * Authenticate current session.
     * @param scheme - Authentication scheme; <tt>"basic"</tt> is the only currently supported scheme.
     * @param secret - Authentication secret, assumed to be already base64 encoded.
     * @param cred - cred
     * @returns Promise which will be resolved/rejected when server reply is received
     */
    login(scheme, secret, cred) {
        return __awaiter(this, void 0, void 0, function* () {
            const pkt = this.initPacket(constants_1.PacketTypes.Login);
            pkt.data.scheme = scheme;
            pkt.data.secret = secret;
            pkt.data.cred = cred;
            const ctrl = yield this.send(pkt, pkt.id);
            this.loginSuccessful(ctrl);
            return ctrl;
        });
    }
    /**
     * Wrapper for `login` with basic authentication
     * @param username - User name
     * @param password - Password
     * @param cred - cred
     * @returns Promise which will be resolved/rejected on receiving server reply.
     */
    loginBasic(username, password, cred) {
        return __awaiter(this, void 0, void 0, function* () {
            const ctrl = this.login(constants_1.AuthenticationScheme.Basic, utilities_1.Utilities.base64encode(username + ':' + password), cred);
            this.lastLogin = username;
            return ctrl;
        });
    }
    /**
     * Wrapper for `login` with token authentication
     * @param token - Token received in response to earlier login.
     * @param cred - cred
     * @returns Promise which will be resolved/rejected on receiving server reply.
     */
    loginToken(token, cred) {
        return this.login(constants_1.AuthenticationScheme.Token, token, cred);
    }
    /**
     * Send a request for resetting an authentication secret.
     * @param scheme - authentication scheme to reset.
     * @param method - method to use for resetting the secret, such as "email" or "tel".
     * @param value - value of the credential to use, a specific email address or a phone number.
     */
    requestResetAuthSecret(scheme, method, value) {
        return this.login(constants_1.AuthenticationScheme.Reset, utilities_1.Utilities.base64encode(scheme + ':' + method + ':' + value));
    }
    /**
     * Get stored authentication token.
     */
    getAuthToken() {
        if (this.authToken && (this.authToken.expires.getTime() > Date.now())) {
            return this.authToken;
        }
        else {
            this.authToken = null;
        }
    }
    /**
     * Application may provide a saved authentication token.
     */
    setAuthToken(token) {
        this.authToken = token;
    }
    /**
     * Set or refresh the push notifications/device token. If the client is connected,
     * the deviceToken can be sent to the server.
     * @param deviceToken - token obtained from the provider
     * @param sendToServer - if true, send deviceToken to server immediately.
     * @returns true if attempt was made to send the token to the server.
     */
    setDeviceToken(deviceToken, sendToServer) {
        let sent = false;
        if (deviceToken && deviceToken !== this.deviceToken) {
            this.deviceToken = deviceToken;
            if (sendToServer && this.isConnected() && this.isAuthenticated()) {
                const pkt = this.initPacket(constants_1.PacketTypes.Hi);
                pkt.data.dev = deviceToken;
                this.send(pkt, pkt.id);
                sent = true;
            }
        }
        return sent;
    }
    /**
     * Send a topic subscription request.
     * @param topicName - Name of the topic to subscribe to
     * @param getParams - Optional subscription metadata query
     * @param setParams - Optional initialization parameters
     */
    subscribe(topicName, getParams, setParams) {
        const pkt = this.initPacket(constants_1.PacketTypes.Sub, topicName);
        if (!topicName) {
            topicName = constants_1.TopicNames.TOPIC_NEW;
        }
        pkt.data.get = getParams;
        if (setParams) {
            if (setParams.sub) {
                pkt.data.set.sub = setParams.sub;
            }
            if (setParams.desc) {
                if (utilities_1.Utilities.isNewGroupTopicName(topicName)) {
                    // Full set.desc params are used for new topics only
                    pkt.data.set.desc = setParams.desc;
                }
                else if (utilities_1.Utilities.topicType(topicName) === 'p2p' && setParams.desc.defacs) {
                    // Use optional default permissions only.
                    pkt.data.set.desc = {
                        defacs: setParams.desc.defacs
                    };
                }
            }
            if (setParams.tags) {
                pkt.data.set.tags = setParams.tags;
            }
        }
        return this.send(pkt, pkt.id);
    }
    /**
     * Detach and optionally unsubscribe from the topic
     * @param topicName - Topic to detach from.
     * @param unSubscribe - If true, detach and unsubscribe, otherwise just detach.
     */
    leave(topicName, unsubscribe) {
        const pkt = this.initPacket(constants_1.PacketTypes.Leave, topicName);
        pkt.data.unsub = unsubscribe;
        return this.send(pkt, pkt.id);
    }
    /**
     * Create message draft without sending it to the server
     * @param topicName - Name of the topic to publish to
     * @param data - Payload to publish
     * @param noEcho - If true, tell the server not to echo the message to the original session.
     */
    createMessage(topicName, data, noEcho = false) {
        return new message_1.Message(topicName, data, !noEcho);
    }
    /**
     * Publish message to topic. The message packet should be created by `createMessage`
     * @param pubPkt - Message to publish
     */
    publishMessage(message) {
        message.resetLocalValues();
        return this.send(message.getPubPacket(this));
    }
    /**
     * Publish {data} message to topic
     * @param topicName - Name of the topic to publish to
     * @param data - Payload to publish
     * @param noEcho - If true, tell the server not to echo the message to the original session.
     */
    publish(topicName, data, noEcho = false) {
        return this.publishMessage(this.createMessage(topicName, data, noEcho));
    }
    /**
     * Request topic metadata
     * @param topicName - Name of the topic to query.
     * @param params - Parameters of the query. Use {Tinode.MetaGetBuilder} to generate.
     */
    getMeta(topicName, params) {
        const pkt = this.initPacket(constants_1.PacketTypes.Get, topicName);
        pkt.data = utilities_1.Utilities.mergeObj(pkt.data, params);
        return this.send(pkt, pkt.id);
    }
    /**
     * Update topic's metadata: description, subscriptions.
     * @param topicName - Topic to update
     * @param params - topic metadata to update
     */
    setMeta(topicName, params) {
        const pkt = this.initPacket(constants_1.PacketTypes.Set, topicName);
        const what = [];
        if (params) {
            ['desc', 'sub', 'tags', 'cred'].forEach((key) => {
                if (params.hasOwnProperty(key)) {
                    what.push(key);
                    pkt.data[key] = params[key];
                }
            });
        }
        if (what.length === 0) {
            return Promise.reject(new Error('Invalid {set} parameters'));
        }
        return this.send(pkt, pkt.id);
    }
    /**
     * Delete some or all messages in a topic.
     * @param topicName - Topic name to delete messages from.
     * @param ranges - Ranges of message IDs to delete
     * @param hard - Hard or soft delete
     */
    delMessages(topicName, ranges, hard) {
        const pkt = this.initPacket(constants_1.PacketTypes.Del, topicName);
        pkt.data.what = 'msg';
        pkt.data.delseq = ranges;
        pkt.data.hard = hard;
        return this.send(pkt, pkt.id);
    }
    /**
     * Delete the topic all together. Requires Owner permission.
     * @param topicName - Name of the topic to delete
     * @param hard - hard-delete topic.
     */
    delTopic(topicName, hard) {
        return __awaiter(this, void 0, void 0, function* () {
            const pkt = this.initPacket(constants_1.PacketTypes.Del, topicName);
            pkt.data.what = 'topic';
            pkt.data.hard = hard;
            const ctrl = yield this.send(pkt, pkt.id);
            this.cacheDel('topic', topicName);
            return ctrl;
        });
    }
    /**
     * Delete subscription. Requires Share permission.
     * @param topicName - Name of the topic to delete
     * @param userId - User ID to remove
     */
    delSubscription(topicName, userId) {
        const pkt = this.initPacket(constants_1.PacketTypes.Del, topicName);
        pkt.data.what = 'sub';
        pkt.data.user = userId;
        return this.send(pkt, pkt.id);
    }
    /**
     * Delete credential. Always sent on 'me' topic.
     * @param method - validation method such as 'email' or 'tel'.
     * @param value - validation value, i.e. 'alice@example.com'.
     */
    delCredential(method, value) {
        const pkt = this.initPacket(constants_1.PacketTypes.Del, constants_1.TopicNames.TOPIC_ME);
        pkt.data.what = 'cred';
        pkt.data.cred = {
            meth: method,
            val: value
        };
        return this.send(pkt, pkt.id);
    }
    /**
     * Request to delete account of the current user.
     * @param hard - hard-delete user.
     */
    delCurrentUser(hard) {
        return __awaiter(this, void 0, void 0, function* () {
            const pkt = this.initPacket(constants_1.PacketTypes.Del, null);
            pkt.data.what = 'user';
            pkt.data.hard = hard;
            const ctrl = yield this.send(pkt, pkt.id);
            this.myUserID = null;
            return ctrl;
        });
    }
    /**
     * Notify server that a message or messages were read or received. Does NOT return promise.
     * @param topicName - Name of the topic where the message is being acknowledged.
     * @param what - Action being acknowledged, either "read" or "recv".
     * @param seq - Maximum id of the message being acknowledged.
     */
    note(topicName, what, seq) {
        if (seq <= 0 || seq >= constants_1.AppSettings.LOCAL_SEQ_ID) {
            throw new Error('Invalid message id ' + seq);
        }
        const pkt = this.initPacket(constants_1.PacketTypes.Note, topicName);
        pkt.data.what = what;
        pkt.data.seq = seq;
        this.send(pkt);
    }
    /**
     * Broadcast a key-press notification to topic subscribers. Used to show
     * typing notifications "user X is typing..."
     * @param topicName - Name of the topic to broadcast to
     */
    noteKeyPress(topicName) {
        const pkt = this.initPacket(constants_1.PacketTypes.Note, topicName);
        pkt.data.what = 'kp';
        this.send(pkt);
    }
    /**
     * Get a named topic, either pull it from cache or create a new instance.
     * There is a single instance of topic for each name
     * @param topicName - Name of the topic to get
     */
    getTopic(topicName) {
        let topic = this.cacheGet('topic', topicName);
        if (!topic && topicName) {
            if (topicName === constants_1.TopicNames.TOPIC_ME) {
                topic = new topic_me_1.TopicMe(this);
            }
            else if (topicName === constants_1.TopicNames.TOPIC_FND) {
                topic = new topic_fnd_1.TopicFnd(this);
            }
            else {
                topic = new topic_1.Topic(topicName, this);
            }
            // topic._new = false;
            this.cachePut('topic', topicName, topic);
            this.attachCacheToTopic(topic);
        }
        return topic;
    }
    /**
     * Instantiate a new unnamed topic. An actual name will be assigned by the server
     */
    newTopic() {
        const topic = new topic_1.Topic(constants_1.TopicNames.TOPIC_NEW, this);
        this.attachCacheToTopic(topic);
        return topic;
    }
    /**
     * Generate unique name  like 'new123456' suitable for creating a new group topic.
     * @returns name which can be used for creating a new group topic.
     */
    newGroupTopicName() {
        return constants_1.TopicNames.TOPIC_NEW + this.getNextUniqueId();
    }
    /**
     * Instantiate a new P2P topic with a given peer
     * @param peer - User id of the peer to start topic with.
     */
    newTopicWith(peer) {
        const topic = new topic_1.Topic(peer, this);
        this.attachCacheToTopic(topic);
        return topic;
    }
    /**
     * Instantiate 'me' topic or get it from cache.
     */
    getMeTopic() {
        return this.getTopic(constants_1.TopicNames.TOPIC_ME);
    }
    /**
     * Instantiate 'fnd' (find) topic or get it from cache.
     */
    getFndTopic() {
        return this.getTopic(constants_1.TopicNames.TOPIC_FND);
    }
    /**
     *  Create a new LargeFileHelper instance
     */
    getLargeFileHelper() {
        return new large_file_helper_1.LargeFileHelper(this);
    }
    /**
     * Get the UID of the the current authenticated user.
     * @returns UID of the current user or undefined if the session is not yet authenticated or if there is no session.
     */
    getCurrentUserID() {
        return this.myUserID;
    }
    /**
     * Check if the given user ID is equal to the current user's UID.
     * @param userId - User id to check.
     */
    isMe(userId) {
        return this.myUserID === userId;
    }
    /**
     * Get login used for last successful authentication.
     */
    getCurrentLogin() {
        return this.lastLogin;
    }
    /**
     * Return information about the server: protocol version and build timestamp.
     */
    getServerInfo() {
        return this.serverInfo;
    }
    /**
     * Return server-provided configuration value (long integer).
     * @param name of the value to return
     * @param defaultValue to return in case server limit is not set or not found
     */
    getServerLimit(name, defaultValue) {
        return (this.serverInfo ? this.serverInfo[name] : null) || defaultValue;
    }
    /**
     * Set UI language to report to the server. Must be called before 'hi' is sent, otherwise it will not be used.
     * @param humanLanguage - human (UI) language, like "en_US" or "zh-Hans".
     */
    setHumanLanguage(humanLanguage) {
        if (humanLanguage) {
            this.humanLanguage = humanLanguage;
        }
    }
    /**
     * Check if given topic is online.
     * @param topicName - Name of the topic to test.
     */
    isTopicOnline(topicName) {
        const me = this.getMeTopic();
        const cont = me && me.getContact(String(name));
        return cont && cont.online;
    }
}
exports.Tinode = Tinode;
