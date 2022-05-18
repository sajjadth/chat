"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicFnd = void 0;
const constants_1 = require("../constants");
const utilities_1 = require("../utilities");
const topic_1 = require("./topic");
class TopicFnd extends topic_1.Topic {
    constructor(tinode) {
        super(constants_1.TopicNames.TOPIC_FND, tinode);
        // List of contacts
        this.contacts = {};
    }
    processMetaSub(subs) {
        let updateCount = Object.getOwnPropertyNames(this.contacts).length;
        // Reset contact list.
        this.contacts = {};
        for (const idx in subs) {
            if (Object.prototype.hasOwnProperty.call(subs, idx)) {
                let sub = subs[idx];
                const indexBy = sub.topic ? sub.topic : sub.user;
                sub.updated = new Date(sub.updated);
                if (sub.seen && sub.seen.when) {
                    sub.seen.when = new Date(sub.seen.when);
                }
                sub = utilities_1.Utilities.mergeToCache(this.contacts, indexBy, sub);
                updateCount++;
                if (this.onMetaSub) {
                    this.onMetaSub.next(sub);
                }
            }
        }
        if (updateCount > 0 && this.onSubsUpdated) {
            this.onSubsUpdated.next(this.contacts);
        }
    }
    publish() {
        return Promise.reject(new Error('Publishing to "fnd" is not supported'));
    }
    setMeta(params) {
        return Object.getPrototypeOf(TopicFnd.prototype).setMeta.call(this, params).then(() => {
            if (Object.keys(this.contacts).length > 0) {
                this.contacts = {};
                this.onSubsUpdated.next([]);
            }
        });
    }
    getContacts() {
        return this.contacts;
    }
}
exports.TopicFnd = TopicFnd;
