/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('This is a test.'),
	async execute(interaction) {
		await interaction.reply({
			content: 'This a test slash command!',
			ephemeral: true,
		});
	},
};