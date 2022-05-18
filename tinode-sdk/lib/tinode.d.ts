import { ConnectionOptions, AutoReconnectData } from './connection';
import { PacketTypes, AuthenticationScheme } from './constants';
import { Packet } from './packet';
import { Message } from './message';
import { Topic } from './topic/topic';
import { TopicMe } from './topic/topic-me';
import { TopicFnd } from './topic/topic-fnd';
import { Subject } from 'rxjs';
import { GetQuery } from './models/get-query';
import { DelRange } from './models/del-range';
import { SetParams } from './models/set-params';
import { AuthToken } from './models/auth-token';
import { OnLoginData } from './models/tinode-events';
import { LargeFileHelper } from './large-file-helper';
import { AccountParams } from './models/account-params';
export declare class Tinode {
    /**
     * Connection config used to initiate a connection
     */
    connectionConfig: ConnectionOptions;
    /**
     * Client's platform
     */
    private hardwareOS;
    /**
     * Client's language
     */
    private humanLanguage;
    /**
     * Specified platform by user
     */
    private platform;
    /**
     * Specified app name by user
     */
    private appName;
    /**
     * If this code is running on a browser, which one?
     */
    private browser;
    /**
     * Logging to console enabled
     */
    private loggingEnabled;
    /**
     * When logging, trip long strings (base64-encoded images) for readability
     */
    private trimLongStrings;
    /**
     * UID of the currently authenticated user.
     */
    private myUserID;
    /**
     * Status of connection: authenticated or not.
     */
    private authenticated;
    /**
     * Login used in the last successful basic authentication
     */
    private lastLogin;
    /**
     * Token which can be used for login instead of login/password.
     */
    authToken: AuthToken;
    /**
     * Counter of received packets
     */
    private inPacketCount;
    /**
     * Counter for generating unique message IDs
     */
    private messageId;
    /**
     * Information about the server, if connected
     */
    private serverInfo;
    /**
     * Push notification token. Called deviceToken for consistency with the Android SDK.
     */
    private deviceToken;
    /**
     * Cache of pending promises by message id.
     */
    private pendingPromises;
    /**
     * A connection object
     */
    private connection;
    /**
     * Tinode's cache of objects
     */
    private cache;
    /**
     * Stores interval to clear later
     */
    private checkExpiredPromisesInterval;
    /**
     * Subject to report login completion.
     */
    onLogin: Subject<OnLoginData>;
    /**
     * Subject to receive server responses to network probes
     */
    onRawMessage: Subject<string>;
    /**
     * Subject to receive server responses to network probes
     */
    onNetworkProbe: Subject<unknown>;
    /**
     * Subject to receive all messages as objects.
     */
    onMessage: Subject<unknown>;
    /**
     * Subject to receive {ctrl} (control) messages.
     */
    onCtrlMessage: Subject<unknown>;
    /**
     * Subject to receive {meta} messages.
     */
    onMetaMessage: Subject<unknown>;
    /**
     * Subject to receive {data} messages.
     */
    onDataMessage: Subject<unknown>;
    /**
     * Subject to receive {pres} messages.
     */
    onPresMessage: Subject<unknown>;
    /**
     * Subject to receive {info} messages.
     */
    onInfoMessage: Subject<unknown>;
    /**
     * Subject for connect event
     */
    onConnect: Subject<unknown>;
    /**
     * Subject for disconnect event
     */
    onDisconnect: Subject<unknown>;
    /**
     * Wrapper for the reconnect iterator callback.
     */
    onAutoReconnectIteration: Subject<AutoReconnectData>;
    /**
     * Connection events subscriptions
     */
    private connectionEventsSubscriptions;
    /**
     * Return information about the current version of this Tinode client library.
     */
    static getVersion(): string;
    /**
     *  Return information about the current name and version of this Tinode library.
     */
    static getLibrary(): string;
    /**
     * To use Tinode in a non browser context, supply WebSocket and XMLHttpRequest providers.
     */
    static setNetworkProviders(ws: any, xmlhttprequest: any): void;
    constructor(appName: string, platform: string, connectionConfig: ConnectionOptions);
    /**
     * Subscribe and handle connection events
     */
    private doConnectionSubscriptions;
    /**
     * Toggle console logging. Logging is off by default.
     * @param enabled - Set to to enable logging to console.
     * @param trimLongStrings - Options to trim long strings
     */
    enableLogging(enabled: boolean, trimLongStrings?: boolean): void;
    /**
     * Generator of packets stubs
     */
    initPacket(type: PacketTypes, topicName?: string): Packet<any>;
    /**
     * Console logger
     * @param str - String to log
     * @param args - arguments
     */
    logger(str: string, ...args: any[]): void;
    /**
     * Put an object into cache
     * @param type - cache type
     * @param name - cache name
     * @param obj - cache object
     */
    private cachePut;
    /**
     * Get an object from cache
     * @param type - cache type
     * @param name - cache name
     */
    private cacheGet;
    /**
     * Delete an object from cache
     * @param type - cache type
     * @param name - cache name
     */
    cacheDel(type: string, name: string): void;
    /**
     * Enumerate all items in cache, call func for each item.
     * Enumeration stops if func returns true.
     * @param func - function to call for each item
     * @param context - function context
     */
    private cacheMap;
    /**
     * Make limited cache management available to topic.
     * Caching user.public only. Everything else is per-topic.
     * @param topic - Topic to attach cache
     */
    private attachCacheToTopic;
    /**
     * Resolve or reject a pending promise.
     * Unresolved promises are stored in _pendingPromises.
     */
    private execPromise;
    /**
     * Stored callbacks will be called when the response packet with this Id arrives
     * @param id - Id of new promise
     */
    private makePromise;
    /**
     * Reject promises which have not been resolved for too long.
     */
    private checkExpiredPromises;
    /**
     * Generates unique message IDs
     */
    getNextUniqueId(): string;
    /**
     * Get User Agent string
     */
    private getUserAgent;
    /**
     * Send a packet. If packet id is provided return a promise.
     * @param pkt - Packet
     * @param id - Message ID
     */
    private send;
    /**
     * REVIEW: types
     * On successful login save server-provided data.
     * @param ctrl - Server response
     */
    private loginSuccessful;
    /**
     * The main message dispatcher.
     * @param data - Server message data
     */
    private onConnectionMessage;
    /**
     * REVIEW: types
     * Handle ctrl type messages
     * @param pkt - Server message data
     */
    private handleCtrlMessage;
    /**
     * REVIEW: types
     * Handle meta type messages
     * @param pkt - Server message data
     */
    private handleMetaMessage;
    /**
     * REVIEW: types
     * Handle data type messages
     * @param pkt - Server message data
     */
    private handleDataMessage;
    /**
     * REVIEW: types
     * Handle pres type messages
     * @param pkt - Server message data
     */
    private handlePresMessage;
    /**
     * REVIEW: types
     * Handle info type messages
     * @param pkt - Server message data
     */
    private handleInfoMessage;
    /**
     * Reset all variables and unsubscribe from all events and topics
     * @param onDisconnectData - Data from connection disconnect event
     */
    private onConnectionDisconnect;
    /**
     * Connect to the server.
     * @param host - name of the host to connect to
     */
    connect(host?: string): Promise<void>;
    /**
     * Attempt to reconnect to the server immediately.
     * @param force - reconnect even if there is a connection already.
     */
    reconnect(force?: boolean): Promise<any>;
    /**
     * Disconnect from the server.
     */
    disconnect(): void;
    /**
     * Check for live connection to server.
     */
    isConnected(): boolean;
    /**
     * Check if connection is authenticated (last login was successful).
     */
    isAuthenticated(): boolean;
    /**
     * Send handshake to the server.
     */
    hello(): Promise<any>;
    /**
     * Create or update an account
     * @param userId - User id to update
     * @param scheme - Authentication scheme; "basic" and "anonymous" are the currently supported schemes.
     * @param secret - Authentication secret, assumed to be already base64 encoded.
     * @param login - Use new account to authenticate current session
     * @param params - User data to pass to the server.
     */
    account(userId: string, scheme: AuthenticationScheme, secret: string, login: boolean, params?: AccountParams): Promise<any>;
    /**
     * Create a new user. Wrapper for `account`.
     * @param scheme - Authentication scheme; "basic" is the only currently supported scheme.
     * @param secret - Authentication secret
     * @param login - Use new account to authenticate current session
     * @param params - User data to pass to the server
     */
    createAccount(scheme: AuthenticationScheme, secret: string, login: boolean, params?: AccountParams): Promise<any>;
    /**
     * Create user with 'basic' authentication scheme and immediately
     * use it for authentication. Wrapper for `account`
     * @param username - Using this username you can log into your account
     * @param password - User's password
     * @param params - User data to pass to the server
     */
    createAccountBasic(username: string, password: string, login: boolean, params?: AccountParams): Promise<any>;
    /**
     * Update user's credentials for 'basic' authentication scheme. Wrapper for `account`
     * @param userId - User ID to update
     * @param username - Using this username you can log into your account
     * @param password - User's password
     * @param params - Data to pass to the server.
     */
    updateAccountBasic(userId: string, username: string, password: string, params?: AccountParams): Promise<any>;
    /**
     * Authenticate current session.
     * @param scheme - Authentication scheme; <tt>"basic"</tt> is the only currently supported scheme.
     * @param secret - Authentication secret, assumed to be already base64 encoded.
     * @param cred - cred
     * @returns Promise which will be resolved/rejected when server reply is received
     */
    login(scheme: AuthenticationScheme, secret: string, cred?: any): Promise<any>;
    /**
     * Wrapper for `login` with basic authentication
     * @param username - User name
     * @param password - Password
     * @param cred - cred
     * @returns Promise which will be resolved/rejected on receiving server reply.
     */
    loginBasic(username: string, password: string, cred?: any): Promise<any>;
    /**
     * Wrapper for `login` with token authentication
     * @param token - Token received in response to earlier login.
     * @param cred - cred
     * @returns Promise which will be resolved/rejected on receiving server reply.
     */
    loginToken(token: string, cred?: any): Promise<any>;
    /**
     * Send a request for resetting an authentication secret.
     * @param scheme - authentication scheme to reset.
     * @param method - method to use for resetting the secret, such as "email" or "tel".
     * @param value - value of the credential to use, a specific email address or a phone number.
     */
    requestResetAuthSecret(scheme: AuthenticationScheme, method: string, value: string): Promise<any>;
    /**
     * Get stored authentication token.
     */
    getAuthToken(): AuthToken;
    /**
     * Application may provide a saved authentication token.
     */
    setAuthToken(token: AuthToken): void;
    /**
     * Set or refresh the push notifications/device token. If the client is connected,
     * the deviceToken can be sent to the server.
     * @param deviceToken - token obtained from the provider
     * @param sendToServer - if true, send deviceToken to server immediately.
     * @returns true if attempt was made to send the token to the server.
     */
    setDeviceToken(deviceToken: string, sendToServer: boolean): boolean;
    /**
     * Send a topic subscription request.
     * @param topicName - Name of the topic to subscribe to
     * @param getParams - Optional subscription metadata query
     * @param setParams - Optional initialization parameters
     */
    subscribe(topicName: string, getParams: GetQuery, setParams: SetParams): Promise<any>;
    /**
     * Detach and optionally unsubscribe from the topic
     * @param topicName - Topic to detach from.
     * @param unSubscribe - If true, detach and unsubscribe, otherwise just detach.
     */
    leave(topicName: string, unsubscribe: boolean): Promise<any>;
    /**
     * Create message draft without sending it to the server
     * @param topicName - Name of the topic to publish to
     * @param data - Payload to publish
     * @param noEcho - If true, tell the server not to echo the message to the original session.
     */
    createMessage(topicName: string, data: any, noEcho?: boolean): Message;
    /**
     * Publish message to topic. The message packet should be created by `createMessage`
     * @param pubPkt - Message to publish
     */
    publishMessage(message: Message): Promise<any>;
    /**
     * Publish {data} message to topic
     * @param topicName - Name of the topic to publish to
     * @param data - Payload to publish
     * @param noEcho - If true, tell the server not to echo the message to the original session.
     */
    publish(topicName: string, data: any, noEcho?: boolean): Promise<any>;
    /**
     * Request topic metadata
     * @param topicName - Name of the topic to query.
     * @param params - Parameters of the query. Use {Tinode.MetaGetBuilder} to generate.
     */
    getMeta(topicName: string, params: GetQuery): Promise<any>;
    /**
     * Update topic's metadata: description, subscriptions.
     * @param topicName - Topic to update
     * @param params - topic metadata to update
     */
    setMeta(topicName: string, params: SetParams): Promise<any>;
    /**
     * Delete some or all messages in a topic.
     * @param topicName - Topic name to delete messages from.
     * @param ranges - Ranges of message IDs to delete
     * @param hard - Hard or soft delete
     */
    delMessages(topicName: string, ranges: DelRange[], hard: boolean): Promise<any>;
    /**
     * Delete the topic all together. Requires Owner permission.
     * @param topicName - Name of the topic to delete
     * @param hard - hard-delete topic.
     */
    delTopic(topicName: string, hard: boolean): Promise<any>;
    /**
     * Delete subscription. Requires Share permission.
     * @param topicName - Name of the topic to delete
     * @param userId - User ID to remove
     */
    delSubscription(topicName: string, userId: string): Promise<any>;
    /**
     * Delete credential. Always sent on 'me' topic.
     * @param method - validation method such as 'email' or 'tel'.
     * @param value - validation value, i.e. 'alice@example.com'.
     */
    delCredential(method: string, value: string): Promise<any>;
    /**
     * Request to delete account of the current user.
     * @param hard - hard-delete user.
     */
    delCurrentUser(hard: boolean): Promise<any>;
    /**
     * Notify server that a message or messages were read or received. Does NOT return promise.
     * @param topicName - Name of the topic where the message is being acknowledged.
     * @param what - Action being acknowledged, either "read" or "recv".
     * @param seq - Maximum id of the message being acknowledged.
     */
    note(topicName: string, what: string, seq: number): void;
    /**
     * Broadcast a key-press notification to topic subscribers. Used to show
     * typing notifications "user X is typing..."
     * @param topicName - Name of the topic to broadcast to
     */
    noteKeyPress(topicName: string): void;
    /**
     * Get a named topic, either pull it from cache or create a new instance.
     * There is a single instance of topic for each name
     * @param topicName - Name of the topic to get
     */
    getTopic(topicName: string): any;
    /**
     * Instantiate a new unnamed topic. An actual name will be assigned by the server
     */
    newTopic(): Topic;
    /**
     * Generate unique name  like 'new123456' suitable for creating a new group topic.
     * @returns name which can be used for creating a new group topic.
     */
    newGroupTopicName(): string;
    /**
     * Instantiate a new P2P topic with a given peer
     * @param peer - User id of the peer to start topic with.
     */
    newTopicWith(peer: string): Topic;
    /**
     * Instantiate 'me' topic or get it from cache.
     */
    getMeTopic(): TopicMe;
    /**
     * Instantiate 'fnd' (find) topic or get it from cache.
     */
    getFndTopic(): TopicFnd;
    /**
     *  Create a new LargeFileHelper instance
     */
    getLargeFileHelper(): LargeFileHelper;
    /**
     * Get the UID of the the current authenticated user.
     * @returns UID of the current user or undefined if the session is not yet authenticated or if there is no session.
     */
    getCurrentUserID(): string;
    /**
     * Check if the given user ID is equal to the current user's UID.
     * @param userId - User id to check.
     */
    isMe(userId: string): boolean;
    /**
     * Get login used for last successful authentication.
     */
    getCurrentLogin(): any;
    /**
     * Return information about the server: protocol version and build timestamp.
     */
    getServerInfo(): any;
    /**
     * Return server-provided configuration value (long integer).
     * @param name of the value to return
     * @param defaultValue to return in case server limit is not set or not found
     */
    getServerLimit(name: any, defaultValue: any): any;
    /**
     * Set UI language to report to the server. Must be called before 'hi' is sent, otherwise it will not be used.
     * @param humanLanguage - human (UI) language, like "en_US" or "zh-Hans".
     */
    setHumanLanguage(humanLanguage: string): void;
    /**
     * Check if given topic is online.
     * @param topicName - Name of the topic to test.
     */
    isTopicOnline(topicName: string): boolean;
}
