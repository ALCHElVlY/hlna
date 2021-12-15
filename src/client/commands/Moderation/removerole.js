/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');

// Import the embed builders
const {
	REMOVE_ROLE_EMBED,
	ERROR_EMBED,
} = require('../../utility/Embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removerole')
		.setDescription('Manually removes a role from a member.')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('The member to remove a role from.')
				.setRequired(true))
		.addRoleOption(option =>
			option.setName('role')
				.setDescription('The role to remove from the member.')
				.setRequired(true)),
	category: 'Moderation',
	async execute(interaction) {
		const { member } = interaction.options._hoistedOptions[0];
		const { role } = interaction.options._hoistedOptions[1];

		try {
			// Check if the member has the role
			if (member.roles.cache.some(r => r.name === role.name));

			// Remove the role from the member.
			await member.roles.remove(role.id).then(async () => {
			// Send a success message.
				await interaction.reply({
					embeds: [REMOVE_ROLE_EMBED(member, role)],
					ephemeral: true,
				});
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