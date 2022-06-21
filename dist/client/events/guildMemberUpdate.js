"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
class GuildMemberUpdateEvent extends structures_1.Event {
    constructor(client) {
        super(client, 'guildMemberUpdate');
    }
    async run(oldMember, newMember) {
        const logger = new structures_1.Logger();
        const rolesAdded = newMember.roles.cache.filter((r) => !oldMember.roles.cache.has(r.id));
        const rolesRemoved = oldMember.roles.cache.filter((r) => !newMember.roles.cache.has(r.id));
        if (rolesAdded.size > 0) {
            const guild = newMember.guild;
            const settings = this.client.settings.get(guild.id);
            if (settings.log_channels <= 0)
                return;
            const channel = settings.log_channels.find((c) => c.log_type === 'role_add');
            const logChannel = channel
                ? this.client.channels.cache.get(channel.channel_id)
                : undefined;
            if (!logChannel)
                return;
            try {
                rolesAdded.forEach((r) => {
                    logger.Log([newMember, r], 'role_add', logChannel);
                });
            }
            catch (e) {
                console.log(e);
            }
        }
        if (rolesRemoved.size > 0) {
            const guild = newMember.guild;
            const settings = this.client.settings.get(guild.id);
            if (settings.log_channels <= 0)
                return;
            const channel = settings.log_channels.find((c) => c.log_type === 'role_remove');
            const logChannel = channel
                ? this.client.channels.cache.get(channel.channel_id)
                : undefined;
            if (!logChannel)
                return;
            try {
                rolesRemoved.forEach((r) => {
                    logger.Log([newMember, r], 'role_remove', logChannel);
                });
            }
            catch (e) {
                console.log(e);
            }
        }
    }
}
exports.default = GuildMemberUpdateEvent;
