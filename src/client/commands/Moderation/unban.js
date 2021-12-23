/* eslint-disable no-unused-vars */
require('dotenv').config();
const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../../../client');
const { Permissions } = require('discord.js');

// Import the embed builders
const {
	BAN_DM_EMBED,
	ERROR_EMBED,
} = require('../../utility/Embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unban a member from the server, or list all bans.')
		.setDefaultPermission(true)
		.addSubcommand(subcommand =>
			subcommand.setName('member')
				.setDescription('The member to unban.')
				.addUserOption(option =>
					option.setName('target')
						.setDescription('The member')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('list')
				.setDescription('List all bans in the server.')),
	category: 'Moderation',
	permissions: ['Moderator'],
	async execute(interaction) {
		const subcommand = interaction.options._subcommand;
		const member = (interaction.options._hoistedOptions[0])
			? interaction.options._hoistedOptions[0].member
			: null;
		const { guild } = interaction.member;
		// const reason = interaction.options._hoistedOptions[1].value;
		const guildBans = [];

		try {
			// Determine the subcommand
			switch (subcommand) {
			case 'member':
				// code
				break;
			case 'list':
				guild.bans.fetch().then(bans => {
					// Handle if the guild has no bans
					if (bans.size <= 0) {
						return interaction.reply({
							embeds: [ERROR_EMBED('there are currently no bans for this server!')],
							ephemeral: true,
						});
					}

					bans.forEach(ban => {
						const data = {
							user: {
								name: ban.user.username,
								id: ban.user.id,
							},
							reason: ban.reason,
						};
						guildBans.push(data);
					});
					console.log(guildBans);
				});
				break;
			}
			// Send the embed and ban the member
			/* await member.send({
				embeds: [BAN_DM_EMBED(interaction.guild, reason)],
			})
				.then(async () => await member.ban({ days: 7, reason: reason }))
				.catch(e => '');*/
		}
		catch (e) {
			return interaction.reply({
				embeds: [ERROR_EMBED(e.message)],
				ephemeral: true,
			});
		}
	},
};