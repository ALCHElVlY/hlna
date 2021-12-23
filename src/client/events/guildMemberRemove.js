// Import the logger class
const Logger = require('../structures/Logger');


module.exports = {
	name: 'guildMemberRemove',
	once: false,
	run: async (client, member) => {
		const settings = client.settings.get(member.guild.id);
		const logger = new Logger();
		// If there is no log channel set, do nothing
		if (settings.log_channels.length <= 0) return;

		// Find the log channel for MEMBER_JOINLEAVE
		const channelID = settings.log_channels
			.find(c => c.action_type === 'member_joinleave').channel_id;
		const logChannel = client.channels.cache.get(channelID);


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