require('dotenv').config();
const axios = require('axios');

module.exports = {
	name: 'ready',
	once: true,
	run: async (client) => {
		console.log(client.user.tag + ' has successfully connected!');

		// Short delay to give the bot time to load before attempting
		// to process refreshing the settings.
		setTimeout(async function() {
			const res = await axios.get(process.env.CONFIGURATION);
			const cache = new Map();


			// Loop through the array to sort the data
			res.data.forEach(e => {
				const toCache = {
					prefix: e.prefix,
					admin_role: e.admin_role,
					dev_role: e.dev_role,
					mod_role: e.mod_role,
					tradeChannels: e.tradeChannels,
				};

				cache.set(e.guild_id, toCache);
				client.settings = cache;
			});
		}, 1000);
	},
};