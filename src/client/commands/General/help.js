/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../../index');
const permissions = require('../../structures/permissions');

// Import the embed builders
const {
	HELP_EMBED,
	ERROR_EMBED,
} = require('../../utility/embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays all available commands.')
		.setDefaultPermission(true),
	category: 'General',
	permissions: ['User'],
	async execute(interaction) {
		const clientCommands = client.commands;
		const commands = [];

		clientCommands.forEach((command) => {
			const { name, description } = command.data;
			const { category } = command;
			const helpData = {
				Category: category,
				Command: `${name} → ${description}`,
			};
			commands.push(helpData);
		});

		try {
			interaction.reply({
				embeds: [HELP_EMBED(commands)],
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