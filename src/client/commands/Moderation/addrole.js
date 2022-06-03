/* eslint-disable no-unused-vars */
// Built-in imports
const { SlashCommandBuilder } = require('@discordjs/builders');

// Internal imports
const { ADD_ROLE_EMBED, ERROR_EMBED } = require('../../utility/Embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Manually adds a role to a member.')
    .setDefaultPermission(true)
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('The member to add the role to.')
        .setRequired(true),
    )
    .addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('The role to add to the member.')
        .setRequired(true),
    ),
  category: 'Moderation',
  permissions: ['Moderator'],
  async execute(interaction) {
    const member = interaction.options.getMember('member');
    const role = interaction.options.getRole('role');

    try {
      // Check if the member has the role already
      if (member.roles.cache.some((r) => r.name === role.name)) return;

      // Add the role to the member.
      await member.roles.add(role).then(async () => {
        // Send a success message.
        await interaction.reply({
          embeds: [ADD_ROLE_EMBED(member, role)],
          ephemeral: true,
        });
      });
    } catch (e) {
      return interaction.reply({
        embeds: [ERROR_EMBED(e.message)],
        ephemeral: true,
      });
    }
  },
};
