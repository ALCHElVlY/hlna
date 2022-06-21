"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
class ChannelDeleteEvent extends structures_1.Event {
    constructor(client) {
        super(client, 'channelDelete');
    }
    async run(channel) {
        console.log(channel);
    }
}
exports.default = ChannelDeleteEvent;
