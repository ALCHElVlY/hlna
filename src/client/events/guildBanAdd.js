// Import the logger class
const Logger = require('../structures/Logger');
const logger = new Logger();

module.exports = {
	name: 'guildBanAdd',
	once: false,
	run: async (client, ban) => {
		console.log(ban.guild.bans);
		const settings = client.settings.get(ban.guild.id);
		if (settings.log_channels <= 0) return;

		// Determine if a log channel is set for the particular log type
		// If the channel is not found, do nothing
		const channel = settings.log_channels.find(c => c.log_type === 'member_ban');
		const logChannel = (channel) ? client.channels.cache.get(channel.channel_id) : undefined;
		if (!logChannel) return;

		try {
			logger.log(
				[ban.user, ban.reason],
				logChannel,
				'member_ban');
		}
		catch (e) {
			console.log(e);
		}
	},
};