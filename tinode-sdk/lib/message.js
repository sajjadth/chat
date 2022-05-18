"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const constants_1 = require("./constants");
const drafty_1 = require("./drafty");
const rxjs_1 = require("rxjs");
class Message {
    constructor(topicName, content, echo = true) {
        /**
         * Current message status
         */
        this.status = constants_1.MessageStatus.NONE;
        // Events
        this.onStatusChange = new rxjs_1.Subject();
        this.echo = echo;
        this.content = content;
        this.topicName = topicName;
        this.status = constants_1.MessageStatus.NONE;
    }
    /**
     * Create a pub packet using this message data
     */
    getPubPacket(tinode) {
        const pkt = tinode.initPacket(constants_1.PacketTypes.Pub, this.topicName);
        const dft = typeof this.content === 'string' ? drafty_1.Drafty.parse(this.content) : this.content;
        pkt.data.content = this.content;
        pkt.data.noecho = !this.echo;
        if (dft && !drafty_1.Drafty.isPlainText(dft)) {
            pkt.data.head = {
                mime: drafty_1.Drafty.getContentType()
            };
            pkt.data.content = dft;
            // Update header with attachment records.
            if (drafty_1.Drafty.hasAttachments(pkt.data.content) && !pkt.data.head.attachments) {
                const attachments = [];
                drafty_1.Drafty.attachments(pkt.data.content, (data) => {
                    attachments.push(data.ref);
                });
                pkt.data.head.attachments = attachments;
            }
        }
        return pkt;
    }
    /**
     * Set message status
     * @param status new status
     */
    setStatus(status) {
        this.status = status;
        this.onStatusChange.next(status);
    }
    /**
     * Simple getter for message status
     */
    getStatus() {
        return this.status;
    }
    /**
     * Reset locally assigned values
     */
    resetLocalValues() {
        this.seq = undefined;
        this.from = undefined;
        this.ts = undefined;
    }
}
exports.Message = Message;
