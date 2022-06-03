/* eslint-disable no-unused-vars */
// Built-in imports
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

// Internal imports
const client = require('../../../client');
const {
  BAN_DM_EMBED,
  ERROR_EMBED,
  SUCCESS_EMBED,
} = require('../../utility/Embeds');
const format = require('../../utility/format');
const { userMention } = format.formatOptions;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a member from the server.')
    .setDefaultPermission(true)
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('The member to ban.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('The reason for banning the member.')
        .setRequired(true),
    ),
  category: 'Moderation',
  permissions: ['Moderator'],
  async execute(interaction) {
    const member = interaction.options.getMember('member');
    const reason = interaction.options.getString('reason');

    try {
      // Handle if the member being banned is the server owner
      if (member.id === interaction.member.guild.ownerId) {
        return interaction.reply({
          embeds: [ERROR_EMBED('You cannot kick the server owner.')],
          ephemeral: true,
        });
      }

      // Handle if the member being banned is the interaction author
      if (member.id === interaction.user.id) {
        return interaction.reply({
          embeds: [ERROR_EMBED('You cannot kick yourself.')],
          ephemeral: true,
        });
      }

      // Handle if the member being banned is the bot
      if (member.id === client.user.id) {
        return interaction.reply({
          embeds: [ERROR_EMBED('You cannot kick me!')],
          ephemeral: true,
        });
      }

      // Handle if the bot has the permission to ban the member
      if (!interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
        return interaction.reply({
          embeds: [ERROR_EMBED('I do not have the permission to kick users.')],
          ephemeral: true,
        });
      }

      // Handle if the interaction author has the permission to ban the member
      if (!interaction.memberPermissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
        return interaction.reply({
          embeds: [
            ERROR_EMBED('You do not have the permission to kick users.'),
          ],
          ephemeral: true,
        });
      }

      // Handle if the reason is too long
      if (reason.length < 1 || reason.length > 25) {
        return interaction.reply({
          embeds: [
            ERROR_EMBED('The reason must be between 1 and 25 characters.'),
          ],
          ephemeral: true,
        });
      }

      // Send the embed and ban the member
      await member
        .send({
          embeds: [BAN_DM_EMBED(interaction.guild, reason)],
        })
        .then(async () => await member.ban({ days: 7, reason: reason }))
        .catch((e) => '');

      // Send the success message
      return await interaction.reply({
        embeds: [
          SUCCESS_EMBED(`Successfully banned ${userMention(member.user.id)}`),
        ],
        ephemeral: true,
      });
    } catch (e) {
      return interaction.reply({
        embeds: [ERROR_EMBED(e.message)],
        ephemeral: true,
      });
    }
  },
};
