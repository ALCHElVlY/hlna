// Import Discord for JDoc references
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');

// Import Collection from Discord.js
const {
	Collection,
} = require('discord.js');

/**
 * The loadMaps function takes in a Discord client and loads
 * all the necessary Collections and Maps.
 * @param {Discord.Client} client A Discord client.
 * @returns {Promise<void>}
 */
async function loadMaps(client) {
	// Load the various maps the bot requires to function
	(async () => {
		// A Collection to store the bots commands
		client.commands = new Collection();

		// A Collection to store the command aliases
		// client.aliases = new Collection();

		// A Collection to store the guild configurable settings
		client.settings = new Collection();

	})();
}
module.exports = loadMaps;