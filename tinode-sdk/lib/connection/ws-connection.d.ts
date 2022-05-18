import { ConnectionOptions } from './models/connection-options';
import { Connection } from './models';
export declare class WSConnection extends Connection {
    socket: WebSocket;
    constructor(options: ConnectionOptions);
    /**
     * Initiate a new connection
     * Returns Promise resolved/rejected when the connection call completes, resolution is called without parameters,
     * rejection passes the {Error} as parameter.
     * @param host - Host name to connect to; if null the old host name will be used.
     * @param force - Force new connection even if one already exists.
     */
    connect(host: string, force: boolean): Promise<any>;
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
