import { ConnectionOptions } from './models/connection-options';
import { Connection } from './models';
export declare class LPConnection extends Connection {
    private poller;
    private sender;
    private LP_URL;
    constructor(options: ConnectionOptions);
    /**
     * Initiate long polling connection connection
     * @param host - Host name to connect to; if null the old host name will be used.
     * @param force - Force new connection even if one already exists.
     */
    connect(host: string, force: boolean): Promise<any>;
    /**
     * Open http poller connection
     * @param url - Created base URL
     * @param resolve - promise resolve callback
     * @param reject - promise reject callback
     */
    private LPPoller;
    /**
     * Returns a http request to send data
     * @param url - Target URL
     */
    private LPSender;
    /**
     * Disconnect this connection
     */
    disconnect(): void;
    /**
     * Send a string to the server.
     * @param msg - String to send.
     */
    sendText(msg: string): void;
    /**
     * Check if current connection exists
     */
    isConnected(): boolean;
}
