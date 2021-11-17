require('dotenv').config();

// Client Variables
const {
	Client,
} = require('discord.js');
const client = new Client({
	allowedMentions: {
		parse: ['users', 'roles'], repliedUser: true,
	},
	intents: [
		'GUILDS',
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'GUILD_MEMBERS',
		'GUILD_BANS',
		'GUILD_EMOJIS_AND_STICKERS',
		'GUILD_INTEGRATIONS',
		'GUILD_PRESENCES',
	],
	partials: ['CHANNEL', 'MESSAGE', 'REACTION', 'GUILD_MEMBER', 'USER'],
});

// Import the command & event handler functions
const {
	loadCommands,
	loadEvents,
	loadMaps,
} = require('./handlers/index');

// Require the utilities module
require('./utility/clientFunctions')(client);


// Load the client maps, events, and commands
// Log the client in
(async () => {
	await loadMaps(client);
	await loadEvents(client);
	await loadCommands('./src/client/commands/');
	await client.login(process.env.BOT_TOKEN);
})();

// Export the client for use elsewhere without passing it
module.exports = client;