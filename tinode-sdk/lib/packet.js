"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Packet = void 0;
/**
 * A packet that we can send to the server
 */
class Packet {
    constructor(name, data, id) {
        this.name = name;
        this.data = data;
        this.id = id;
        this.failed = false;
        this.sending = false;
    }
}
exports.Packet = Packet;
