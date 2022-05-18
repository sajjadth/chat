"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaGetBuilder = void 0;
/**
 * Helper class for constructing GetQuery
 */
class MetaGetBuilder {
    constructor(tinode, topic) {
        this.tinode = tinode;
        const me = tinode.getMeTopic();
        this.contact = me && me.getContact(topic.name);
        this.topic = topic;
        this.what = {};
    }
    /**
     * Get latest timestamp
     */
    getIms() {
        const cupd = this.contact && this.contact.updated;
        const tupd = this.topic.lastDescUpdate || 0;
        return cupd > tupd ? cupd : tupd;
    }
    /**
     * Add query parameters to fetch messages within explicit limits
     * @param since - messages newer than this (inclusive);
     * @param before - older than this (exclusive)
     * @param limit - number of messages to fetch
     */
    withData(since, before, limit) {
        this.what.data = {
            since,
            before,
            limit,
        };
        return this;
    }
    /**
     * Add query parameters to fetch messages newer than the latest saved message.
     * @param limit - number of messages to fetch
     */
    withLaterData(limit) {
        return this.withData(this.topic.maxSeq > 0 ? this.topic.maxSeq + 1 : undefined, undefined, limit);
    }
    /**
     * Add query parameters to fetch messages older than the earliest saved message.
     * @param limit - maximum number of messages to fetch
     */
    withEarlierData(limit) {
        return this.withData(undefined, this.topic.minSeq > 0 ? this.topic.minSeq : undefined, limit);
    }
    /**
     * Add query parameters to fetch topic description if it's newer than the given timestamp.
     * @param ims - fetch messages newer than this timestamp
     */
    withDesc(ims) {
        this.what.desc = { ims };
        return this;
    }
    /**
     * Add query parameters to fetch topic description if it's newer than the last update.
     */
    withLaterDesc() {
        return this.withDesc(this.getIms());
    }
    /**
     * Add query parameters to fetch subscriptions
     * @param ims - fetch subscriptions modified more recently than this timestamp
     * @param limit - maximum number of subscriptions to fetch
     * @param userOrTopic - user ID or topic name to fetch for fetching one subscription
     */
    withSub(ims, limit, userOrTopic) {
        const opts = { ims, limit };
        if (this.topic.getType() === 'me') {
            opts.topic = userOrTopic;
        }
        else {
            opts.user = userOrTopic;
        }
        this.what.sub = opts;
        return this;
    }
    /**
     * Add query parameters to fetch a single subscription
     * @param ims - fetch subscriptions modified more recently than this timestamp
     * @param userOrTopic - user ID or topic name to fetch for fetching one subscription
     */
    withOneSub(ims, userOrTopic) {
        return this.withSub(ims, undefined, userOrTopic);
    }
    /**
     * Add query parameters to fetch a single subscription if it's been updated since the last update
     * @param userOrTopic - user ID or topic name to fetch for fetching one subscription.
     */
    withLaterOneSub(userOrTopic) {
        return this.withOneSub(this.topic.lastSubsUpdate, userOrTopic);
    }
    /**
     * Add query parameters to fetch subscriptions updated since the last update
     * @param limit - maximum number of subscriptions to fetch
     */
    withLaterSub(limit) {
        return this.withSub(this.topic.getType() === 'p2p' ? this.getIms() : this.topic.lastSubsUpdate, limit);
    }
    /**
     * Add query parameters to fetch topic tags
     */
    withTags() {
        this.what.tags = true;
        return this;
    }
    /**
     * Add query parameters to fetch user's credentials. 'me' topic only
     */
    withCred() {
        if (this.topic.getType() === 'me') {
            this.what.cred = true;
        }
        else {
            this.tinode.logger('ERROR: Invalid topic type for MetaGetBuilder:withCreds', this.topic.getType());
        }
        return this;
    }
    /**
     * Add query parameters to fetch deleted messages within explicit limits. Any/all parameters can be null.
     * @param since - ids of messages deleted since this 'del' id (inclusive)
     * @param limit - number of deleted message ids to fetch
     */
    withDel(since, limit) {
        if (since || limit) {
            this.what.del = { since, limit };
        }
        return this;
    }
    /**
     * Add query parameters to fetch messages deleted after the saved 'del' id.
     * @param limit - number of deleted message ids to fetch
     */
    withLaterDel(limit) {
        // Specify 'since' only if we have already received some messages. If
        // we have no locally cached messages then we don't care if any messages were deleted.
        return this.withDel(this.topic.maxSeq > 0 ? this.topic.maxDel + 1 : undefined, limit);
    }
    /**
     *  Construct parameters
     */
    build() {
        const what = [];
        const instance = this;
        let params = {};
        ['data', 'sub', 'desc', 'tags', 'cred', 'del'].forEach((key) => {
            if (instance.what.hasOwnProperty(key)) {
                what.push(key);
                if (Object.getOwnPropertyNames(instance.what[key]).length > 0) {
                    params[key] = instance.what[key];
                }
            }
        });
        if (what.length > 0) {
            params.what = what.join(' ');
        }
        else {
            params = undefined;
        }
        return params;
    }
}
exports.MetaGetBuilder = MetaGetBuilder;
