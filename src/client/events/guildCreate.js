const axios = require('axios');

module.exports = {
	name: 'guildCreate',
	once: false,
	run: async (client, guild) => {
		axios.post(process.env.CONFIGURATION, {
			guild_id: guild.id,
		})
			.then(() => console.log(`Added guild ${guild.name} to the database`))
			.catch((e) => console.error(e));
	},
};