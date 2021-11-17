require('dotenv').config();

// Import the client
const client = require('./client/index');
const SlashCommands = require('./client/structures/SlashCommands');
const slash = new SlashCommands(client);

// Development guild ID
const guildID = '686731263956090915';

(async () => {
	await slash.deployGuildOnly(guildID);
})();