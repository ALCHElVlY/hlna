/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const format = require('../../utility/format');
const client = require('../../index');
const permissions = require('../../structures/permissions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays all available commands.')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('Display help for all, or specific commands.')
				.setRequired(true)
				.addChoices([
					// Default choice
					['All', 'all'],
					// ARK
					// Configuration
					['Settings', 'settings'],
					// General
					['Test', 'test'],
				])),
	async execute(interaction) {
		const embed = format.embed();
		const settings = client.settings.get(interaction.guild.id);
		const helpCategory = interaction.options._hoistedOptions[0].value;
		console.log(client.commands);


		embed.setTitle('Command List')
			.setDescription([
				'For example usage, visit the documentation!',
			].join('\n'));

		try {
			interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
		}
		catch(e) {
			embed.setTitle('An error has occured.')
				.setDescription(e.message);
			return interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
		}
	},
};