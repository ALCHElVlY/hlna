// Import the logger class
const Logger = require('../structures/Logger');

module.exports = {
	name: 'guildMemberRemove',
	once: false,
	run: async (client, member) => {
		const logger = new Logger();
		const settings = client.settings.get(member.guild.id);
		if (settings.log_channels.length <= 0) return;
		const logChannel = client.channels.cache.get(settings.log_channels
			.find(c => c.log_type === 'member_joinleave').channel_id);
		console.log(logChannel);

		// If the channel is not found, do nothing
		if (!logChannel) return;

		try {
			logger.log(
				member,
				logChannel,
				'member_leave');
		}
		catch (e) {
			console.log(e);
		}
	},
};