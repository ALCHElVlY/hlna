/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../../../client');
const { Permissions } = require('discord.js');

// Import the embed builders
const {
	REMOVE_MUTE_EMBED,
	ERROR_EMBED,
} = require('../../utility/Embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Unmutes a member')
		.setDefaultPermission(true)
		.addUserOption(option =>
			option.setName('member')
				.setDescription('The member to unmute.')
				.setRequired(true)),
	category: 'Moderation',
	permissions: ['Moderator'],
	async execute(interaction) {
		const settings = client.settings.get(interaction.guild.id);
		const muteRole = interaction.guild.roles.cache.get(settings['roles'].mute_role);
		const { member } = interaction.options._hoistedOptions[0];

		try {
			// Check if the member is muted
			if (!member.roles.cache.has(muteRole.id)) {
				throw new Error('The member is not muted.');
			}

			// Remove the mute role
			member.roles.remove(muteRole);

			// Send the success embed
			interaction.reply({
				embeds: [REMOVE_MUTE_EMBED(member)],
				ephemeral: true,
			});
		}
		catch (e) {
			return interaction.reply({
				embeds: [ERROR_EMBED(e.message)],
				ephemeral: true,
			});
		}
	},
};