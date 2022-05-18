import { GetQuery } from './models/get-query';
import { Tinode } from './tinode';
import { Topic } from './topic';
/**
 * Helper class for constructing GetQuery
 */
export declare class MetaGetBuilder {
    tinode: Tinode;
    contact: any;
    topic: Topic;
    what: any;
    constructor(tinode: Tinode, topic: Topic);
    /**
     * Get latest timestamp
     */
    private getIms;
    /**
     * Add query parameters to fetch messages within explicit limits
     * @param since - messages newer than this (inclusive);
     * @param before - older than this (exclusive)
     * @param limit - number of messages to fetch
     */
    withData(since?: number, before?: number, limit?: number): MetaGetBuilder;
    /**
     * Add query parameters to fetch messages newer than the latest saved message.
     * @param limit - number of messages to fetch
     */
    withLaterData(limit?: number): MetaGetBuilder;
    /**
     * Add query parameters to fetch messages older than the earliest saved message.
     * @param limit - maximum number of messages to fetch
     */
    withEarlierData(limit?: number): MetaGetBuilder;
    /**
     * Add query parameters to fetch topic description if it's newer than the given timestamp.
     * @param ims - fetch messages newer than this timestamp
     */
    withDesc(ims?: Date): MetaGetBuilder;
    /**
     * Add query parameters to fetch topic description if it's newer than the last update.
     */
    withLaterDesc(): MetaGetBuilder;
    /**
     * Add query parameters to fetch subscriptions
     * @param ims - fetch subscriptions modified more recently than this timestamp
     * @param limit - maximum number of subscriptions to fetch
     * @param userOrTopic - user ID or topic name to fetch for fetching one subscription
     */
    withSub(ims?: Date, limit?: number, userOrTopic?: string): MetaGetBuilder;
    /**
     * Add query parameters to fetch a single subscription
     * @param ims - fetch subscriptions modified more recently than this timestamp
     * @param userOrTopic - user ID or topic name to fetch for fetching one subscription
     */
    withOneSub(ims?: Date, userOrTopic?: string): MetaGetBuilder;
    /**
     * Add query parameters to fetch a single subscription if it's been updated since the last update
     * @param userOrTopic - user ID or topic name to fetch for fetching one subscription.
     */
    withLaterOneSub(userOrTopic?: string): MetaGetBuilder;
    /**
     * Add query parameters to fetch subscriptions updated since the last update
     * @param limit - maximum number of subscriptions to fetch
     */
    withLaterSub(limit?: number): MetaGetBuilder;
    /**
     * Add query parameters to fetch topic tags
     */
    withTags(): MetaGetBuilder;
    /**
     * Add query parameters to fetch user's credentials. 'me' topic only
     */
    withCred(): MetaGetBuilder;
    /**
     * Add query parameters to fetch deleted messages within explicit limits. Any/all parameters can be null.
     * @param since - ids of messages deleted since this 'del' id (inclusive)
     * @param limit - number of deleted message ids to fetch
     */
    withDel(since?: number, limit?: number): MetaGetBuilder;
    /**
     * Add query parameters to fetch messages deleted after the saved 'del' id.
     * @param limit - number of deleted message ids to fetch
     */
    withLaterDel(limit?: number): MetaGetBuilder;
    /**
     *  Construct parameters
     */
    build(): GetQuery;
}
