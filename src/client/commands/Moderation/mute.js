/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../../../client');
const { Permissions } = require('discord.js');

// Import the embed builders
const {
	ADD_MUTE_EMBED,
	ERROR_EMBED,
} = require('../../utility/Embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Mute a member. Time based, or manual unmute.')
		.setDefaultPermission(true)
		.addUserOption(option =>
			option.setName('member')
				.setDescription('The member to mute.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('time')
				.setDescription('The time to mute the member for. (ex: 1m, 1h, 1d, 1w)')
				.setRequired(false)),
	category: 'Moderation',
	permissions: ['Moderator'],
	async execute(interaction) {
		const settings = client.settings.get(interaction.guild.id);
		const muteRole = interaction.guild.roles.cache.get(settings['roles'].mute_role);
		const { member } = interaction.options._hoistedOptions[0];
		const time = (interaction.options._hoistedOptions[1])
			? interaction.options._hoistedOptions[1].value
			: null;
		const muteDuration = (time) ? client.formatMuteTime(time) : null;

		try {
			// Handle if the member being muted is a moderator
			// bypasses if the author is an administrator
			if (member.permissions.has(Permissions.FLAGS.MANAGE_ROLES) &&
				!interaction.memberPermissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
				throw new Error('You cannot mute an administrator.');
			}

			// Handle if the member being muted is the bot(HLN-A)
			if (member.id === interaction.client.user.id) {
				throw new Error('You cannot mute me!');
			}

			// Handle if the member being muted is the interaction author
			if (member.id === interaction.user.id) {
				throw new Error('You cannot mute yourself!');
			}

			switch (muteRole) {
			default:
				switch (time) {
				case null:
					member.roles.add(muteRole);
					return interaction.reply({
						embeds: [ADD_MUTE_EMBED(member, time)],
						ephemeral: true,
					});
				default:
					member.roles.add(muteRole);
					interaction.reply({
						embeds: [ADD_MUTE_EMBED(member, time)],
						ephemeral: true,
					});
					setTimeout(() => {
						member.roles.remove(muteRole);
					}, muteDuration);
				}
			}
		}
		catch (e) {
			interaction.reply({
				embeds: [ERROR_EMBED(e.message)],
				ephemeral: true,
			});
		}
	},
};