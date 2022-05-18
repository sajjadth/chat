import { MessageStatus } from './constants';
import { PubPacketData } from './models/packet-data';
import { Packet } from './packet';
import { Tinode } from './tinode';
import { Subject } from 'rxjs';
export declare class Message {
    /**
     * UTC timestamp
     */
    ts: Date;
    /**
     * Sender's topic name
     */
    from: string;
    /**
     * Locally assigned message ID
     */
    seq: number;
    /**
     * Message payload, might be a string or drafty
     */
    content: any;
    /**
     * If true, tell the server to echo the message to the original session.
     */
    echo: boolean;
    /**
     * Name of the topic that this message is for
     */
    topicName: string;
    /**
     * Current message status
     */
    status: MessageStatus;
    /**
     * Used to avoid message duplication when retrying failed publish
     */
    noForwarding: boolean;
    cancelled: boolean;
    onStatusChange: Subject<MessageStatus>;
    constructor(topicName: string, content: any, echo?: boolean);
    /**
     * Create a pub packet using this message data
     */
    getPubPacket(tinode: Tinode): Packet<PubPacketData>;
    /**
     * Set message status
     * @param status new status
     */
    setStatus(status: MessageStatus): void;
    /**
     * Simple getter for message status
     */
    getStatus(): MessageStatus;
    /**
     * Reset locally assigned values
     */
    resetLocalValues(): void;
}
