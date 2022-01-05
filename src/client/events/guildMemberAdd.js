// Import the logger class
const Logger = require('../structures/Logger');

module.exports = {
	name: 'guildMemberAdd',
	once: false,
	run: async (client, member) => {
		const logger = new Logger();
		const settings = client.settings.get(member.guild.id);
		if (settings.log_channels.length <= 0) return;

		// Determine if a log channel is set for the particular log type
		// If the channel is not found, do nothing
		const channel = settings.log_channels.find(c => c.log_type === 'member_joinleave');
		const logChannel = (channel) ? client.channels.cache.get(channel.channel_id) : undefined;
		if (!logChannel) return;

		try {
			logger.log(
				member,
				logChannel,
				'member_join');
		}
		catch (e) {
			console.log(e);
		}
	},
};