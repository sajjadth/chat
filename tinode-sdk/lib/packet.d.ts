/**
 * A packet that we can send to the server
 */
export declare class Packet<T> {
    readonly name: string;
    id: string;
    data: T;
    sending: boolean;
    failed: boolean;
    cancelled: boolean;
    noForwarding: boolean;
    constructor(name: string, data: T, id: string);
}
