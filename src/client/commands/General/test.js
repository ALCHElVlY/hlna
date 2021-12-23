/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../../index');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('This is a test.'),
	category: 'General',
	permissions: ['Bot Developer'],
	async execute(interaction) {
		// code
	},
};