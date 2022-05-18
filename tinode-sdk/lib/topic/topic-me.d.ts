import { Credential } from '../models/credential';
import { AccessMode } from '../access-mode';
import { Tinode } from '../tinode';
import { Topic } from './topic';
import { Subject } from 'rxjs';
export interface ContactUpdateData {
    what: any;
    contact: any;
}
export declare class TopicMe extends Topic {
    contacts: any;
    onContactUpdate: Subject<ContactUpdateData>;
    constructor(tinode: Tinode);
    processMetaDesc(desc: any): void;
    processMetaSub(subs: any): void;
    /**
     * Called by Tinode when meta.sub is received.
     */
    processMetaCreds: (creds: any[], upd: boolean) => void;
    routePres(pres: any): void;
    publish(): Promise<any>;
    delCredential(method: string, value: string): Promise<any>;
    getContacts(): any;
    /**
     * Update a cached contact with new read/received/message count.
     * @param contactName - UID of contact to update.
     * @param what - Which count to update, one of <tt>"read", "recv", "msg"</tt>
     * @param seq - New value of the count.
     * @param ts - Timestamp of the update.
     */
    setMsgReadRecv(contactName: string, what: string, seq: number, ts?: Date): void;
    /**
     * Get cached read/received/message count for the given contact.
     * @param contactName - UID of contact to read.
     * @param what - Which count to read, one of <tt>"read", "recv", "msg"</tt>
     */
    getMsgReadRecv(contactName: string, what: string): number;
    /**
     * Get a contact from cache.
     * @param name - Name of the contact to get, either a UID (for p2p topics) or a topic name.
     */
    getContact(name: string): any;
    /**
     * Get access mode of a given contact from cache.
     */
    getAccessMode(): AccessMode;
    /**
     * Check if contact is archived, i.e. contact.private.arch == true.
     * @param name - Name of the contact to check archived status, either a UID (for p2p topics) or a topic name.
     */
    isContactArchived(name: string): boolean;
    /**
     * Get the user's credentials: email, phone, etc.
     */
    getCredentials(): Credential[];
}
