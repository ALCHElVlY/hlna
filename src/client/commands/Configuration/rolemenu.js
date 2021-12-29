/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const RoleMenuSetup = require('../../utility/functions/Configuration/roleMenuSetup');

// Import the embed builders
const {
	ERROR_EMBED,
} = require('../../utility/embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rolemenu')
		.setDescription('Create a self-assignable role menu.')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to send the menu to.')
				.setRequired(false))
		.setDefaultPermission(true),
	category: 'Configuration',
	permissions: ['Server Owner'],
	async execute(interaction) {
		const channel = interaction.options._hoistedOptions.length > 0
			? interaction.options._hoistedOptions[0].channel
			: interaction.channel;

		try {
			await RoleMenuSetup(channel, interaction);
		}
		catch (e) {
			return interaction.reply({
				embeds: [ERROR_EMBED(e.message)],
				ephemeral: true,
			});
		}
	},
};