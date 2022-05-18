"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationScheme = exports.PacketTypes = exports.ServerConfigurationKeys = exports.TopicTypesObj = exports.XDRStatus = exports.AccessModePermissionsBITMASK = exports.AccessModeFlags = exports.DEL_CHAR = exports.base64codes = exports.base64abc = exports.AppSettings = exports.MessageStatus = exports.TopicNames = exports.AppInfo = void 0;
/**
 * Contains basic information about library
 */
var AppInfo;
(function (AppInfo) {
    AppInfo["VERSION"] = "0.16";
    AppInfo["PROTOCOL_VERSION"] = "0";
    AppInfo["LIBRARY"] = "tinode-typescript";
})(AppInfo = exports.AppInfo || (exports.AppInfo = {}));
/**
 * Constant topic names
 */
var TopicNames;
(function (TopicNames) {
    TopicNames["TOPIC_NEW"] = "new";
    TopicNames["TOPIC_ME"] = "me";
    TopicNames["TOPIC_FND"] = "fnd";
    TopicNames["TOPIC_SYS"] = "sys";
    TopicNames["USER_NEW"] = "new";
    TopicNames["TOPIC_CHAN"] = "chn";
    TopicNames["TOPIC_NEW_CHAN"] = "nch";
})(TopicNames = exports.TopicNames || (exports.TopicNames = {}));
var MessageStatus;
(function (MessageStatus) {
    /**
     * Status not assigned.
     */
    MessageStatus[MessageStatus["NONE"] = 0] = "NONE";
    /**
     * Local ID assigned, in progress to be sent.
     */
    MessageStatus[MessageStatus["QUEUED"] = 1] = "QUEUED";
    /**
     * Transmission started.
     */
    MessageStatus[MessageStatus["SENDING"] = 2] = "SENDING";
    /**
     * At least one attempt was made to send the message.
     */
    MessageStatus[MessageStatus["FAILED"] = 3] = "FAILED";
    /**
     * Delivered to the server.
     */
    MessageStatus[MessageStatus["SENT"] = 4] = "SENT";
    /**
     * Received by the client.
     */
    MessageStatus[MessageStatus["RECEIVED"] = 5] = "RECEIVED";
    /**
     * Read by the user.
     */
    MessageStatus[MessageStatus["READ"] = 6] = "READ";
    /**
     *  Message from another user.
     */
    MessageStatus[MessageStatus["TO_ME"] = 7] = "TO_ME";
})(MessageStatus = exports.MessageStatus || (exports.MessageStatus = {}));
/**
 * Global settings for library
 */
exports.AppSettings = {
    LOCAL_SEQ_ID: 0xFFFFFFF,
    NETWORK_ERROR: 503,
    ERROR_TEXT: 'Connection failed',
    EXPIRE_PROMISES_TIMEOUT: 5000,
    EXPIRE_PROMISES_PERIOD: 1000,
    NETWORK_USER: 418,
    NETWORK_USER_TEXT: 'Disconnected by client', // Error text to return when user disconnected from server.
};
exports.base64abc = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'
];
exports.base64codes = [
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 62, 255, 255, 255, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 255, 255, 255, 0, 255, 255,
    255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 255, 255, 255, 255, 255,
    255, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
];
exports.DEL_CHAR = '\u2421';
/**
 * Access mode permission types
 */
var AccessModeFlags;
(function (AccessModeFlags) {
    AccessModeFlags[AccessModeFlags["NONE"] = 0] = "NONE";
    AccessModeFlags[AccessModeFlags["JOIN"] = 1] = "JOIN";
    AccessModeFlags[AccessModeFlags["READ"] = 2] = "READ";
    AccessModeFlags[AccessModeFlags["WRITE"] = 4] = "WRITE";
    AccessModeFlags[AccessModeFlags["PRES"] = 8] = "PRES";
    AccessModeFlags[AccessModeFlags["APPROVE"] = 16] = "APPROVE";
    AccessModeFlags[AccessModeFlags["SHARE"] = 32] = "SHARE";
    AccessModeFlags[AccessModeFlags["DELETE"] = 64] = "DELETE";
    AccessModeFlags[AccessModeFlags["OWNER"] = 128] = "OWNER";
    AccessModeFlags[AccessModeFlags["INVALID"] = 1048576] = "INVALID";
})(AccessModeFlags = exports.AccessModeFlags || (exports.AccessModeFlags = {}));
exports.AccessModePermissionsBITMASK = AccessModeFlags.JOIN
    | AccessModeFlags.READ
    | AccessModeFlags.WRITE
    | AccessModeFlags.PRES
    | AccessModeFlags.APPROVE
    | AccessModeFlags.SHARE
    | AccessModeFlags.DELETE
    | AccessModeFlags.OWNER;
var XDRStatus;
(function (XDRStatus) {
    XDRStatus[XDRStatus["UNSENT"] = 0] = "UNSENT";
    XDRStatus[XDRStatus["OPENED"] = 1] = "OPENED";
    XDRStatus[XDRStatus["HEADERS_RECEIVED"] = 2] = "HEADERS_RECEIVED";
    XDRStatus[XDRStatus["LOADING"] = 3] = "LOADING";
    XDRStatus[XDRStatus["DONE"] = 4] = "DONE";
})(XDRStatus = exports.XDRStatus || (exports.XDRStatus = {}));
exports.TopicTypesObj = {
    me: 'me',
    fnd: 'fnd',
    grp: 'grp',
    new: 'grp',
    usr: 'p2p',
    sys: 'sys',
};
var ServerConfigurationKeys;
(function (ServerConfigurationKeys) {
    ServerConfigurationKeys["MaxMessageSize"] = "maxMessageSize";
    ServerConfigurationKeys["MaxSubscriberCount"] = "maxSubscriberCount";
    ServerConfigurationKeys["MaxTagCount"] = "maxTagCount";
    ServerConfigurationKeys["MaxFileUploadSize"] = "maxFileUploadSize";
})(ServerConfigurationKeys = exports.ServerConfigurationKeys || (exports.ServerConfigurationKeys = {}));
var PacketTypes;
(function (PacketTypes) {
    PacketTypes["Hi"] = "hi";
    PacketTypes["Acc"] = "acc";
    PacketTypes["Login"] = "login";
    PacketTypes["Sub"] = "sub";
    PacketTypes["Leave"] = "leave";
    PacketTypes["Pub"] = "pub";
    PacketTypes["Get"] = "get";
    PacketTypes["Set"] = "set";
    PacketTypes["Del"] = "del";
    PacketTypes["Note"] = "note";
})(PacketTypes = exports.PacketTypes || (exports.PacketTypes = {}));
var AuthenticationScheme;
(function (AuthenticationScheme) {
    AuthenticationScheme["Basic"] = "basic";
    AuthenticationScheme["Anonymous"] = "anonymous";
    AuthenticationScheme["Token"] = "token";
    AuthenticationScheme["Reset"] = "reset";
})(AuthenticationScheme = exports.AuthenticationScheme || (exports.AuthenticationScheme = {}));
