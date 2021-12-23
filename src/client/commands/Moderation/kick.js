/* eslint-disable no-unused-vars */
require('dotenv').config();
const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../../../client');
const { Permissions } = require('discord.js');

// Import the embed builders
const {
	KICK_DM_EMBED,
	ERROR_EMBED,
} = require('../../utility/Embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks a member from the server.')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('The member to kick.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('The reason for kicking the member.')
				.setRequired(true)),
	category: 'Moderation',
	permissions: ['Moderator'],
	async execute(interaction) {
		const { member } = interaction.options._hoistedOptions[0];
		const reason = interaction.options._hoistedOptions[1].value;

		try {
			// Handle if the member being kicked is the server owner
			if (member.id === interaction.member.guild.ownerId) {
				return interaction.reply({
					embeds: [ERROR_EMBED('You cannot kick the server owner.')],
					ephemeral: true,
				});
			}

			// Handle if the member being kicked is the interaction author
			if (member.id === interaction.user.id) {
				return interaction.reply({
					embeds: [ERROR_EMBED('You cannot kick yourself.')],
					ephemeral: true,
				});
			}

			// Handle if the member being kicked is the bot
			if (member.id === client.user.id) {
				return interaction.reply({
					embeds: [ERROR_EMBED('You cannot kick me!')],
					ephemeral: true,
				});
			}

			// Handle if the bot has the permission to kick the member
			if (!interaction.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
				return interaction.reply({
					embeds: [ERROR_EMBED('I do not have the permission to kick users.')],
					ephemeral: true,
				});
			}

			// Handle if the interaction author has the permission to kick the member
			if (!interaction.memberPermissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
				return interaction.reply({
					embeds: [ERROR_EMBED('You do not have the permission to kick users.')],
					ephemeral: true,
				});
			}

			// Send the embed and kick the member
			await member.send({
				embeds: [KICK_DM_EMBED(interaction.guild, reason)],
			})
				.then(async () => await member.kick(reason))
				.catch(e => '');
		}
		catch (e) {
			return interaction.reply({
				embeds: [ERROR_EMBED(e.message)],
				ephemeral: true,
			});
		}
	},
};