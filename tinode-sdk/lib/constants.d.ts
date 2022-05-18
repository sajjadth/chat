/**
 * Contains basic information about library
 */
export declare enum AppInfo {
    VERSION = "0.16",
    PROTOCOL_VERSION = "0",
    LIBRARY = "tinode-typescript"
}
/**
 * Constant topic names
 */
export declare enum TopicNames {
    TOPIC_NEW = "new",
    TOPIC_ME = "me",
    TOPIC_FND = "fnd",
    TOPIC_SYS = "sys",
    USER_NEW = "new",
    TOPIC_CHAN = "chn",
    TOPIC_NEW_CHAN = "nch"
}
export declare enum MessageStatus {
    /**
     * Status not assigned.
     */
    NONE = 0,
    /**
     * Local ID assigned, in progress to be sent.
     */
    QUEUED = 1,
    /**
     * Transmission started.
     */
    SENDING = 2,
    /**
     * At least one attempt was made to send the message.
     */
    FAILED = 3,
    /**
     * Delivered to the server.
     */
    SENT = 4,
    /**
     * Received by the client.
     */
    RECEIVED = 5,
    /**
     * Read by the user.
     */
    READ = 6,
    /**
     *  Message from another user.
     */
    TO_ME = 7
}
/**
 * Global settings for library
 */
export declare const AppSettings: {
    LOCAL_SEQ_ID: number;
    NETWORK_ERROR: number;
    ERROR_TEXT: string;
    EXPIRE_PROMISES_TIMEOUT: number;
    EXPIRE_PROMISES_PERIOD: number;
    NETWORK_USER: number;
    NETWORK_USER_TEXT: string;
};
export declare const base64abc: string[];
export declare const base64codes: number[];
export declare const DEL_CHAR = "\u2421";
/**
 * Access mode permission types
 */
export declare enum AccessModeFlags {
    NONE = 0,
    JOIN = 1,
    READ = 2,
    WRITE = 4,
    PRES = 8,
    APPROVE = 16,
    SHARE = 32,
    DELETE = 64,
    OWNER = 128,
    INVALID = 1048576
}
export declare const AccessModePermissionsBITMASK: number;
export declare enum XDRStatus {
    UNSENT = 0,
    OPENED = 1,
    HEADERS_RECEIVED = 2,
    LOADING = 3,
    DONE = 4
}
export declare const TopicTypesObj: {
    me: string;
    fnd: string;
    grp: string;
    new: string;
    usr: string;
    sys: string;
};
export declare enum ServerConfigurationKeys {
    MaxMessageSize = "maxMessageSize",
    MaxSubscriberCount = "maxSubscriberCount",
    MaxTagCount = "maxTagCount",
    MaxFileUploadSize = "maxFileUploadSize"
}
export declare enum PacketTypes {
    Hi = "hi",
    Acc = "acc",
    Login = "login",
    Sub = "sub",
    Leave = "leave",
    Pub = "pub",
    Get = "get",
    Set = "set",
    Del = "del",
    Note = "note"
}
export declare enum AuthenticationScheme {
    Basic = "basic",
    Anonymous = "anonymous",
    Token = "token",
    Reset = "reset"
}
