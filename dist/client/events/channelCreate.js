"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
class ChannelCreateEvent extends structures_1.Event {
    constructor(client) {
        super(client, 'channelCreate');
    }
    async run(channel) {
        console.log(channel);
    }
}
exports.default = ChannelCreateEvent;
