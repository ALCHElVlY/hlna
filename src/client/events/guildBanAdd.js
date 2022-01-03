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
		const logChannel = (settings)
			? client.channels.cache.get(settings.log_channels
				.find(c => c.log_type === 'member_ban').channel_id)
			: undefined;

		// If no log channel is set, ignore
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