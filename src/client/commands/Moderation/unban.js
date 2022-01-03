/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const format = require('../../utility/format');
const client = require('../../../client');

// Import the format options
const {
	userMention,
} = format.formatOptions;

// Import the embed builders
const {
	BAN_LIST_EMBED,
	ERROR_EMBED,
	SUCCESS_EMBED,
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
			? interaction.options._hoistedOptions[0].value
			: null;
		const { guild } = interaction.member;
		// const reason = interaction.options._hoistedOptions[1].value;
		const guildBans = [];

		try {
			// Determine the subcommand
			switch (subcommand) {
			case 'member':
				guild.members.unban(member).then(async () => {
					await interaction.reply({
						embeds: [SUCCESS_EMBED(`${userMention(member)} has been unbanned.`)],
						ephemeral: true,
					});
				});
				break;
			case 'list':
				guild.bans
					.fetch().then(async (bans) => {
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

						// Send the embed
						await interaction.reply({
							embeds: [BAN_LIST_EMBED(guild, guildBans)],
							ephemeral: true,
						});
					});
				break;
			}
		}
		catch (e) {
			return interaction.reply({
				embeds: [ERROR_EMBED(e.message)],
				ephemeral: true,
			});
		}
	},
};