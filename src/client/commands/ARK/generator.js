/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');

// Import the generator embed
const {
	GENERATOR_EMBED,
	ERROR_EMBED,
} = require('../../utility/embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('generator')
		.setDescription('Calculates the time before a gas generator runs out of fuel.')
		.setDefaultPermission(true)
		.addIntegerOption(option =>
			option.setName('fuel_amount')
				.setDescription('The amount of fuel in the generator.')
				.setRequired(true)),
	category: 'ARK',
	permissions: ['User'],
	async execute(interaction) {
		const { value } = interaction.options._hoistedOptions[0];

		// Set the multiplier and calulate the consumption rate.
		const multiplier = 3600;
		const fuel_amount = value;
		const consumption_rate = (fuel_amount * multiplier);

		try {
			// Handle invalid fuel amount.
			if (fuel_amount <= 0) {
				throw Error('Fuel amount must be a positive number greater than 0.');
			}

			// Send the embed.
			interaction.reply({
				embeds: [GENERATOR_EMBED(fuel_amount, consumption_rate)],
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