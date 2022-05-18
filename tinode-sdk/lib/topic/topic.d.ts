import { MessageStatus } from '../constants';
import { SetDesc, SetParams, SetSub } from '../models/set-params';
import { MetaGetBuilder } from '../meta-get-builder';
import { Credential } from '../models/credential';
import { GetQuery } from '../models/get-query';
import { DelRange } from '../models/del-range';
import { AccessMode } from '../access-mode';
import { Message } from '../message';
import { Tinode } from '../tinode';
import { Subject } from 'rxjs';
export declare class Topic {
    /**
     * Topic created but not yet synced with the server. Used only during initialization.
     */
    private new;
    /**
     * User discovery tags
     */
    private tags;
    /**
     * Parent Tinode object
     */
    tinode: Tinode;
    /**
     * Locally cached data
     * Subscribed users, for tracking read/recv/msg notifications.
     */
    private users;
    /**
     * Credentials such as email or phone number
     */
    protected credentials: Credential[];
    /**
     * Boolean, true if the topic is currently live
     */
    protected subscribed: boolean;
    /**
     * Timestamp when the topic was created
     */
    private created;
    /**
     * Timestamp when the topic was last updated
     */
    private update;
    /**
     * Timestamp of the last messages
     */
    private touched;
    /**
     * Indicator that the last request for earlier messages returned 0.
     */
    private noEarlierMsgs;
    /**
     * Access mode, see AccessMode
     */
    protected acs: AccessMode;
    /**
     * Current value of locally issued seqId, used for pending messages.
     */
    private queuedSeqId;
    /**
     * Message cache, sorted by message seq values, from old to new.
     */
    private messages;
    /**
     * The maximum known {data.seq} value.
     */
    maxSeq: number;
    /**
     * The minimum known {data.seq} value.
     */
    minSeq: number;
    /**
     * The maximum known deletion ID.
     */
    maxDel: number;
    /**
     * Topic name
     */
    name: string;
    /**
     * Timestamp when topic meta-desc update was received.
     */
    lastDescUpdate: any;
    /**
     * Timestamp when topic meta-subs update was received.
     */
    lastSubsUpdate: any;
    /**
     * per-topic private data
     */
    private: any;
    /**
     * per-topic public data
     */
    public: any;
    seq: number;
    updated: any;
    clear: any;
    onData: Subject<any>;
    onMeta: Subject<any>;
    onPres: Subject<any>;
    onInfo: Subject<any>;
    onMetaSub: Subject<any>;
    onMetaDesc: Subject<any>;
    onSubsUpdated: Subject<any>;
    onTagsUpdated: Subject<any>;
    onCredsUpdated: Subject<any>;
    onDeleteTopic: Subject<any>;
    onAllMessagesReceived: Subject<any>;
    cacheDelSelf: () => void;
    cachePutSelf: () => void;
    cacheGetUser: (userId: string) => any;
    cacheDelUser: (userId: string) => any;
    cachePutUser: (userId: string, cached: any) => void;
    processMetaCreds: (creds: any[], update?: boolean) => void;
    constructor(name: string, tinode: Tinode);
    /**
     * Check if the topic is subscribed.
     * @returns Subscription status
     */
    isSubscribed(): boolean;
    /**
     * Request this topic to subscribe
     * @param getParams - get query parameters.
     * @param setParams - set parameters.
     */
    subscribe(getParams: GetQuery, setParams: SetParams): Promise<any>;
    /**
     * Create a draft of a message without sending it to the server.
     * @param data - Content to wrap in a draft.
     * @param noEcho - If true server will not echo message back to originating
     */
    createMessage(data: any, noEcho: boolean): Message;
    /**
     * Immediately publish data to topic. Wrapper for Tinode.publish
     * @param data - Data to publish, either plain string or a Drafty object.
     * @param noEcho - If <tt>true</tt> server will not echo message back to originating
     */
    publish(data: any, noEcho: boolean): Promise<any>;
    /**
     * Publish message created by create message
     * @param pub - {data} object to publish. Must be created by createMessage
     */
    publishMessage(message: Message): Promise<any>;
    /**
     * Add message to local message cache, send to the server when the promise is resolved.
     * If promise is null or undefined, the message will be sent immediately.
     * The message is sent when the
     * The message should be created by createMessage.
     * This is probably not the final API.
     * @param msg - Message to use as a draft.
     * @param prom - Message will be sent when this promise is resolved, discarded if rejected.
     */
    publishDraft(msg: Message, prom?: Promise<any>): Promise<any>;
    /**
     * Leave the topic, optionally unsubscribe. Leaving the topic means the topic will stop
     * receiving updates from the server. Unsubscribing will terminate user's relationship with the topic.
     * Wrapper for Tinode.leave
     * @param unsubscribe - If true, unsubscribe, otherwise just leave.
     */
    leave(unsubscribe: boolean): Promise<any>;
    /**
     * Request topic metadata from the server.
     * @param params - parameters
     */
    getMeta(params: GetQuery): Promise<any>;
    /**
     * Request more messages from the server
     * @param limit - number of messages to get.
     * @param forward - if true, request newer messages.
     */
    getMessagesPage(limit: number, forward: boolean): Promise<any>;
    /**
     * Update topic metadata.
     * @param params - parameters to update.
     */
    setMeta(params: SetParams): Promise<any>;
    /**
     * Update access mode of the current user or of another topic subscriber.
     * @param uid - UID of the user to update or null to update current user.
     * @param update - the update value, full or delta.
     */
    updateMode(uid: string, update: string): Promise<any>;
    /**
     * Create new topic subscription. Wrapper for Tinode.setMeta.
     * @param userId - ID of the user to invite
     * @param mode - Access mode. <tt>null</tt> means to use default.
     */
    invite(userId: string, mode: string): Promise<any>;
    /**
     * Archive or un-archive the topic. Wrapper for Tinode.setMeta.
     * @param arch - true to archive the topic, false otherwise
     */
    archive(arch: boolean): Promise<any>;
    /**
     * Delete messages. Hard-deleting messages requires Owner permission.
     * @param ranges - Ranges of message IDs to delete.
     * @param hard - Hard or soft delete
     */
    delMessages(ranges: DelRange[], hard?: boolean): Promise<any>;
    /**
     *  Delete all messages. Hard-deleting messages requires Owner permission.
     * @param hard - true if messages should be hard-deleted.
     */
    delMessagesAll(hard?: boolean): Promise<any>;
    /**
     * Delete multiple messages defined by their IDs. Hard-deleting messages requires Owner permission.
     * @param list - list of seq IDs to delete
     * @param hard - true if messages should be hard-deleted.
     */
    delMessagesList(list: number[], hard?: boolean): Promise<any>;
    /**
     *  Delete topic. Requires Owner permission. Wrapper for delTopic
     * @param hard - had-delete topic.
     */
    delTopic(hard?: boolean): Promise<any>;
    /**
     * Delete subscription. Requires Share permission. Wrapper for Tinode.delSubscription
     * @param user - ID of the user to remove subscription for.
     */
    delSubscription(user: string): Promise<any>;
    /**
     * Send a read/recv notification
     * @param what - what notification to send: <tt>recv</tt>, <tt>read</tt>.
     * @param seq - ID or the message read or received.
     */
    note(what: string, seq: number): void;
    /**
     * Send a 'recv' receipt. Wrapper for Tinode.noteRecv.
     * @param seq - ID of the message to acknowledge.
     */
    noteRecv(seq: number): void;
    /**
     * Send a 'read' receipt. Wrapper for Tinode.noteRead.
     * @param seq - ID of the message to acknowledge or 0/undefined to acknowledge the latest messages.
     */
    noteRead(seq: number): void;
    /**
     * Send a key-press notification. Wrapper for Tinode.noteKeyPress.
     */
    noteKeyPress(): void;
    /**
     * Get user description from global cache. The user does not need to be a
     * subscriber of this topic.
     * @param uid - ID of the user to fetch.
     */
    userDesc(uid: string): any;
    /**
     * Get description of the p2p peer from subscription cache.
     */
    p2pPeerDesc(): any;
    /**
     * Iterate over cached subscribers. If callback is undefined, use this.onMetaSub.
     */
    getSubscribers(): any[];
    /**
     * Get cached subscription for the given user ID.
     * @param uid - id of the user to query for
     */
    subscriber(uid: string): any;
    /**
     * Get a copy of cached tags.
     */
    getTags(): any[];
    /**
     * Get cached messages
     * @param sinceId - Optional seqId to start iterating from (inclusive)
     * @param beforeId - Optional seqId to stop iterating before (exclusive).`.
     */
    getMessages(sinceId?: number, beforeId?: number): any[];
    /**
     * Get cached unsent messages.
     */
    queuedMessages(): any[];
    /**
     * Get the number of topic subscribers who marked this message as either recv or read
     * Current user is excluded from the count.
     * @param what - what notification to send: recv, read.
     * @param seq - ID or the message read or received.
     */
    msgReceiptCount(what: string, seq: number): number;
    /**
     * Get the number of topic subscribers who marked this message (and all older messages) as read.
     * The current user is excluded from the count.
     * @param seq - Message id to check.
     */
    msgReadCount(seq: number): number;
    /**
     * Get the number of topic subscribers who marked this message (and all older messages) as received.
     * The current user is excluded from the count.
     * @param seq - Message id to check.
     */
    msgRecvCount(seq: number): number;
    /**
     * Check if cached message IDs indicate that the server may have more messages.
     * @param newer - Check for newer messages
     */
    msgHasMoreMessages(newer?: boolean): boolean;
    /**
     * Check if the given seq Id is id of the most recent message.
     * @param seqId - id of the message to check
     */
    isNewMessage(seqId: number): boolean;
    /**
     * Remove one message from local cache.
     * @param seqId id of the message to remove from cache.
     */
    flushMessage(seqId: number): any;
    /**
     * Update message's seqId.
     * @param msg - message packet.
     * @param newSeqId - new seq id for
     */
    swapMessageId(msg: Message, newSeqId: number): void;
    /**
     * Remove a range of messages from the local cache.
     * @param fromId seq ID of the first message to remove (inclusive).
     * @param untilId seqID of the last message to remove (exclusive).
     */
    flushMessageRange(fromId: number, untilId: number): any[];
    /**
     * Attempt to stop message from being sent.
     * @param seqId id of the message to stop sending and remove from cache.
     */
    cancelSend(seqId: number): boolean;
    /**
     * Get type of the topic: me, p2p, grp, fnd...
     */
    getType(): string;
    /**
     * Get user's cumulative access mode of the topic.
     */
    getAccessMode(): AccessMode;
    /**
     * Initialize new meta Tinode.GetQuery builder. The query is attached to the current topic.
     * It will not work correctly if used with a different topic.
     */
    startMetaQuery(): MetaGetBuilder;
    /**
     * heck if topic is archived, i.e. private.arch == true.
     */
    isArchived(): boolean;
    /**
     * Check if topic is a channel.
     */
    isChannel(): boolean;
    /**
     * Check if topic is a group topic.
     */
    isGroup(): boolean;
    /**
     * Check if topic is a p2p topic.
     */
    isP2P(): boolean;
    /**
     * Get status (queued, sent, received etc) of a given message in the context
     * of this topic.
     */
    msgStatus(msg: any): MessageStatus;
    /**
     * Process data message
     * @param data data
     */
    routeData(data: Message): void;
    /**
     * Process metadata message
     */
    routeMeta(meta: any): void;
    /**
     * Process presence change message
     * TODO determine input value type
     */
    routePres(pres: any): void;
    /**
     * Process {info} message
     * TODO determine input value type
     */
    routeInfo(info: any): void;
    /**
     * Called by Tinode when meta.desc packet is received.
     * Called by 'me' topic on contact update (desc.noForwarding is true).
     * @param desc - Desc packet
     */
    processMetaDesc(desc: SetDesc): void;
    /**
     * Called by Tinode when meta.sub is received or in response to received
     * {ctrl} after setMeta-sub.
     * @param subs Subscriptions
     */
    processMetaSub(subs: SetSub[]): void;
    processMetaTags(tags: any): void;
    /**
     * Delete cached messages and update cached transaction IDs
     */
    processDelMessages(clear: any, delseq: any): void;
    /**
     * Topic is informed that the entire response to {get what=data} has been received.
     * @param count - Messages count
     */
    allMessagesReceived(count: any): void;
    /**
     * Reset subscribed state
     */
    resetSub(): void;
    /**
     * This topic is either deleted or unsubscribed from.
     */
    gone(): void;
    /**
     * Update global user cache and local subscribers cache.
     * Don't call this method for non-subscribers.
     * @param userId - user id
     * @param obj - user object
     */
    updateCachedUser(userId: string, obj: any): any;
    /**
     * Get local seqId for a queued message.
     */
    getQueuedSeqId(): number;
    /**
     * Calculate ranges of missing messages.
     */
    private updateDeletedRanges;
}
