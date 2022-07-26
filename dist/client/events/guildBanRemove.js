"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
class GuildBanRemoveEvent extends structures_1.Event {
    constructor(client) {
        super(client, 'guildBanRemove');
    }
    async run(ban) {
        console.log(ban);
    }
}
exports.default = GuildBanRemoveEvent;
