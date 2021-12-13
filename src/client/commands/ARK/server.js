/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../../index');

// Import the format options
const format = require('../../utility/format');
const {
	highlighted,
} = format.formatOptions;

// Import the generator embed
const {
	SERVER_EMBED,
	ERROR_EMBED,
} = require('../../utility/embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Query the battlemetrics API for ARK Official server info.')
		.addStringOption(option =>
			option.setName('server_name')
				.setDescription('The name of the server to search for.')
				.setRequired(true)),
	category: 'ARK',
	async execute(interaction) {
		const { value } = interaction.options._hoistedOptions[0];
		const data = await client.fetchServerData(value);

		try {
			// Send the embed.
			interaction.reply({
				embeds: [data],
				ephemeral: true,
			});
		}
		catch(e) {
			return interaction.reply({
				embeds: [ERROR_EMBED(e.message)],
				ephemeral: true,
			});
		}
	},
};