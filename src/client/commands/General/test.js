/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../../index');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('This is a test.'),
	category: 'General',
	async execute(interaction) {
		const clientCommands = client.commands;
		const commands = [];
		console.log(clientCommands);

		/* clientCommands.forEach((command) => {
			const { name, description } = command.data;

			console.log(`${name} → ${description}`);
		});*/
	},
};