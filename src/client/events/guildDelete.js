require('dotenv').config();
const axios = require('axios');

module.exports = {
	name: 'guildCreate',
	once: false,
	run: async (client, guild) => {
		axios.delete(process.env.CONFIGURATION, {
			guild_id: guild.id,
		})
			.then(() => console.log(`Removed guild ${guild.name} from the database`))
			.catch((e) => console.error(e));
	},
};