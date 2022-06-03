require('dotenv').config();
/* eslint-disable no-unused-vars */
// Built-in imports
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

// Internal imports
const client = require('../../../client');
const {
  KICK_DM_EMBED,
  ERROR_EMBED,
  SUCCESS_EMBED,
} = require('../../utility/Embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a member from the server.')
    .setDefaultPermission(true)
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('The member to kick.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('The reason for kicking the member.')
        .setRequired(true),
    ),
  category: 'Moderation',
  permissions: ['Moderator'],
  async execute(interaction) {
    const member = interaction.options.getMember('member');
    const reason = interaction.options.getString('reason');

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
      if (
        !interaction.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)
      ) {
        return interaction.reply({
          embeds: [ERROR_EMBED('I do not have the permission to kick users.')],
          ephemeral: true,
        });
      }

      // Handle if the interaction author has the permission to kick the member
      if (!interaction.memberPermissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
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

      // Send the embed and kick the member
      await member
        .send({
          embeds: [KICK_DM_EMBED(interaction.guild, reason)],
        })
        .then(async () => await member.kick(reason))
        .catch((e) => '');

      // Send a success message
      return await interaction.reply({
        embeds: [SUCCESS_EMBED(`Successfully kicked ${member.user.tag}`)],
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
