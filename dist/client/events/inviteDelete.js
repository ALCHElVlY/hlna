"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
class InviteDeleteEvent extends structures_1.Event {
    constructor(client) {
        super(client, 'inviteDelete');
    }
    async run(invite) {
        console.log(invite);
    }
}
exports.default = InviteDeleteEvent;
