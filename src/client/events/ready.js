const axios = require('axios');
const _getGameStatus = require('../utility/functions/getGameStatus');

module.exports = {
	name: 'ready',
	once: true,
	run: async (client) => {
		console.log(client.user.tag + ' has successfully connected!');

		// Short delay to allow the bot to fully connect
		// before trying to process refreshing the settings
		setTimeout(async () => {
			const res = await axios.get(process.env.CONFIGURATION, {
				headers: {
					'Authorization': 'Bearer ' + process.env.API_KEY,
				},
			});
			const cache = new Map();

			// loop through the array to sort the data
			res.data.forEach(e => {
				const toCache = {
					features: {
						shop_management: e.features.shop_management,
						member_welcome: e.features.member_welcome,
						anti_raid: e.features.anti_raid,
						invite_tracking: e.features.invite_tracking,
					},
					roles: {
						admin_role: e.roles.admin_role,
						dev_role: e.roles.dev_role,
						mod_role: e.roles.mod_role,
						verified_role: e.roles.verified_role,
						mute_role: e.roles.mute_role,
					},
					log_channels: e.log_channels,
				};


				// Cache the settings
				cache.set(e.guild_id, toCache);
				client.settings = cache;
			});
		}, 1000);

		// Sends API request for server status, data is used to send live update of server status.
		await _getGameStatus(client);
	},
};