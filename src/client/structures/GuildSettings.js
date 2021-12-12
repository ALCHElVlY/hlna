/* eslint-disable no-unused-vars */
// Import Discord for JDoc references
const Discord = require('discord.js');
const client = require('../index');

// Import the worker functions
const {
	configWorker_prefix,
	configWorker_roles,
} = require('../utility/functions/Configuration/index');

class GuildSettings {
	// eslint-disable-next-line no-empty-function
	constructor() {}


	/**
     * The edit method accepts a Discord interaction as an
     * argument and handles the editing of the guild settings.
     * @param {Discord.Interaction} interaction
     */
	async edit(interaction) {
		// Prompt the user for the setting they want to edit
		interaction.reply({
			content: 'Which setting would you like to edit?',
		});

		// Create a filter for the message collector
		const filter = m => {
			// If the message author is the interaction author, return true
			if (m.author.id === interaction.user.id) return true;
			// Else return false
			return false;
		};

		try {
			// Await for the user response
			const response = await interaction.channel.awaitMessages({
				filter,
				max: 1,
				time: 30000,
				errors: ['time'],
			});
			if (response) {
				const { content } = response.first();
				switch (content) {
				case 'prefix':
					await configWorker_prefix(client, interaction);
					break;
				case 'roles':
					await configWorker_roles(client, interaction, response);
					break;
				}
			}
		}
		catch (e) {
			console.log(e);
		}
	}
}
module.exports = GuildSettings;