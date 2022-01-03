// Import the logger class
const Logger = require('../structures/Logger');


module.exports = {
	name: 'guildMemberAdd',
	once: false,
	run: async (client, member) => {
		const settings = client.settings.get(member.guild.id);
		const logger = new Logger();


		// If there is no log channel set, do nothing
		if (settings.log_channels.length <= 0) return;

		// Find the log channel for MEMBER_JOINLEAVE
		const channelID = settings.log_channels
			.find(c => c.log_type === 'member_joinleave').channel_id;
		const logChannel = client.channels.cache.get(channelID);
		console.log(console.log(settings.log_channels));

		// If the channel is not found, do nothing
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