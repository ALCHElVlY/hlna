/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');

// Import the embed builders
const {
	ERROR_EMBED,
} = require('../../utility/Embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sweep')
		.setDescription('Bulk delete x amount of messages from a channel.')
		.addNumberOption(option =>
			option.setName('amount')
				.setDescription('The amount of messages to delete.')
				.setRequired(true))
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to delete messages from.')
				.setRequired(false)),
	category: 'Moderation',
	permissions: ['Moderator'],
	async execute(interaction) {
		const value = interaction.options._hoistedOptions;

		try {
			console.log(value);
		}
		catch (e) {
			return interaction.reply({
				embeds: [ERROR_EMBED(e.message)],
				ephemeral: true,
			});
		}
	},
};