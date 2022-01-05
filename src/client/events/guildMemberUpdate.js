// Import the logger class
const Logger = require('../structures/Logger');
const logger = new Logger();

module.exports = {
	name: 'guildMemberUpdate',
	once: false,
	run: async (client, oldMember, newMember) => {
		// Determine if a member lost or gained a role
		const rolesAdded = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
		const rolesRemoved = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

		// If the member gained a role, log it
		if (rolesAdded.size > 0) {
			const guild = newMember.guild;
			const settings = client.settings.get(guild.id);
			if (settings.log_channels <= 0) return;

			// Determine if a log channel is set for the particular log type
			// If the channel is not found, do nothing
			const channel = settings.log_channels.find(c => c.log_type === 'role_add');
			const logChannel = (channel) ? client.channels.cache.get(channel.channel_id) : undefined;
			if (!logChannel) return;

			try {
				rolesAdded.forEach(r => {
					logger.log(
						[newMember, r],
						logChannel,
						'role_add');
				});
			}
			catch (e) {
				console.log(e);
			}
		}

		// If the member lost a role, log it
		if (rolesRemoved.size > 0) {
			const guild = newMember.guild;
			const settings = client.settings.get(guild.id);
			if (settings.log_channels <= 0) return;

			// Determine if a log channel is set for the particular log type
			// If the channel is not found, do nothing
			const channel = settings.log_channels.find(c => c.log_type === 'role_remove');
			const logChannel = (channel) ? client.channels.cache.get(channel.channel_id) : undefined;
			if (!logChannel) return;

			try {
				rolesRemoved.forEach(r => {
					logger.log(
						[newMember, r],
						logChannel,
						'role_remove');
				});
			}
			catch (e) {
				console.log(e);
			}
		}
	},
};