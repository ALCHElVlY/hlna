const axios = require('axios');

module.exports = {
	name: 'guildCreate',
	once: false,
	run: async (client, guild) => {
		// Send an API request to add the guild to the database
		axios.post(process.env.CONFIGURATION, {
			guild_id: guild.id,
		}, { headers: { 'Authorization': 'Bearer ' + process.env.API_KEY } })
			.then(() => console.log('Guild Added', {
				Name: guild.name,
				ID: guild.id,
			}))
			.catch((e) => console.error(e));
	},
};