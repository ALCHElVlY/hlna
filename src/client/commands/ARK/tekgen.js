/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../../index');

// Import the generator embed
const {
	TEKGEN_EMBED,
	ERROR_EMBED,
} = require('../../utility/embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tekgen')
		.setDescription('Calculates the time before a tek generator runs out of fuel.')
		.setDefaultPermission(true)
		.addIntegerOption(option =>
			option.setName('element')
				.setDescription('The amount of element in the tek generator.')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('radius')
				.setDescription('The radius setting of the tek generator.')
				.setRequired(true)
				.addChoice('1', 1)
				.addChoice('2', 2)
				.addChoice('5', 5)
				.addChoice('10', 10)),
	category: 'ARK',
	permissions: ['User'],
	async execute(interaction) {
		const element = interaction.options._hoistedOptions[0].value;
		const radius = interaction.options._hoistedOptions[1].value;

		// Set the multiplier and calulate the consumption rate.
		const multiplier = client.set_multiplier(radius);
		const consumption_rate = ((element / multiplier) * 18 * 3600);

		try {
			// Handle invalid fuel amount.
			if (element <= 0) {
				throw Error('Element must be a positive number greater than 0.');
			}

			// Send the embed.
			interaction.reply({
				embeds: [TEKGEN_EMBED(element, radius, consumption_rate)],
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