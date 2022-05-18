import { AutoReconnectData, OnDisconnetData } from './event-types';
import { ConnectionOptions } from './connection-options';
import { BackoffSettings } from './backoff-settings';
import { Transport } from './transport';
import { Subject } from 'rxjs';
/**
 * Connection base class
 */
export declare abstract class Connection {
    /**
     * Settings for exponential backoff
     */
    protected backoffSettings: BackoffSettings;
    /**
     * Contains current connection configuration
     */
    protected config: ConnectionOptions;
    /**
     * Backoff timer timeout
     */
    protected boffTimer: any;
    /**
     * Backoff iteration counter
     */
    protected boffIteration: number;
    /**
     *  Indicator if the socket was manually closed - don't autoReconnect if true.
     */
    protected boffClosed: boolean;
    /**
     * A callback to report logging events.
     */
    logger: any;
    /**
     * Will be emitted when connection opens
     */
    onOpen: Subject<void>;
    /**
     * Will be emitted when a message is received
     */
    onMessage: Subject<any>;
    /**
     * Will be emitted on connection disconnect
     */
    onDisconnect: Subject<OnDisconnetData>;
    /**
     * Will be emitted when connection tries to reconnect automatically
     */
    onAutoReconnectIteration: Subject<AutoReconnectData>;
    constructor(config: ConnectionOptions, backoffSettings?: BackoffSettings);
    /**
     * Returns connection transport method
     */
    get transport(): Transport;
    /**
     * Backoff implementation - reconnect after a timeout.
     */
    protected boffReconnect(): void;
    /**
     * Terminate auto-reconnect process.
     */
    protected backoffStop(): void;
    /**
     * Try to restore a network connection, also reset backoff.
     * @param force - reconnect even if there is a live connection already.
     */
    reconnect(force?: boolean): void;
    /**
     * Send a message to test
     */
    protected probe(): void;
    /**
     * Check if the given network transport is available.
     * @param transport - either 'ws' (websocket) or 'lp' (long polling).
     */
    protected transportAvailable(transport: string): any;
    /**
     * Reset auto reconnect counter to zero.
     */
    backoffReset(): void;
    /**
     * Initiate a new connection
     * @param host - Host name to connect to; if null the old host name will be used.
     * @param force - Force new connection even if one already exists.
     */
    abstract connect(host?: string, force?: boolean): Promise<any>;
    /**
     * Disconnect this connection
     */
    abstract disconnect(): void;
    /**
     * Send a string to the server.
     * @param msg - String to send.
     */
    abstract sendText(msg: string): void;
    /**
     * Check if current connection exists
     */
    abstract isConnected(): boolean;
}
