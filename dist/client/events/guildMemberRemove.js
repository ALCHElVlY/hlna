"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
class GuildMemberRemoveEvent extends structures_1.Event {
    constructor(client) {
        super(client, 'guildMemberRemove');
    }
    async run(member) {
        const logger = new structures_1.Logger();
        const settings = this.client.settings.get(member.guild.id);
        if (settings.log_channels.length <= 0)
            return;
        const channel = settings.log_channels.find((c) => c.log_type === 'member_joinleave');
        const logChannel = channel
            ? this.client.channels.cache.get(channel.channel_id)
            : undefined;
        if (!logChannel)
            return;
        try {
            logger.Log(member, 'member_leave', logChannel);
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.default = GuildMemberRemoveEvent;
