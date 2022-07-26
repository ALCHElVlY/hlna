"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
class GuildBanAddEvent extends structures_1.Event {
    constructor(client) {
        super(client, 'guildBanAdd');
    }
    async run(ban) {
        console.log(ban.guild.bans);
        const settings = this.client.settings.get(ban.guild.id);
        if (settings.log_channels <= 0)
            return;
        const channel = settings.log_channels.find((c) => c.log_type === 'member_ban');
        const logChannel = channel
            ? this.client.channels.cache.get(channel.channel_id)
            : undefined;
        if (!logChannel)
            return;
    }
}
exports.default = GuildBanAddEvent;
