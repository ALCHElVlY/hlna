/* eslint-disable no-unused-vars */
// Built-in imports
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

// Internal imports
const client = require('../../../client');
const { ADD_MUTE_EMBED, ERROR_EMBED } = require('../../utility/Embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a member. Time based, or manual unmute.')
    .setDefaultPermission(true)
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('The member to mute.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('time')
        .setDescription('The time to mute the member for. (ex: 1m, 1h, 1d, 1w)')
        .setRequired(false),
    ),
  category: 'Moderation',
  permissions: ['Moderator'],
  async execute(interaction) {
    const settings = client.settings.get(interaction.guild.id);
    const muteRole = interaction.guild.roles.cache.get(
      settings['roles'].mute_role,
    );
    const member = interaction.options.getString('member');
    const time = interaction.options.getString('time')
      ? interaction.options.getString('time')
      : null;
    const muteDuration = time ? client.formatMuteTime(time) : null;
    const muteTime = 31536000000 * 100;

    try {
      // Check if the member using the command has the required permissions
      if (
        !interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)
      ) {
        throw Error(
          'You do not have the required permissions to mute members.',
        );
      }
      // Handle if the member being muted is a moderator
      // bypasses if the author is an administrator
      if (
        member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS) &&
        !interaction.memberPermissions.has(Permissions.FLAGS.ADMINISTRATOR)
      ) {
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
              await member.roles.add(muteRole);
              await member.timeout(muteTime, 'This is a test manual unmute');
              await interaction.reply({
                embeds: [ADD_MUTE_EMBED(member, time)],
                ephemeral: true,
              });
              break;
            default:
              await member.roles.add(muteRole);
              await member.timeout(muteTime, 'This is a test timed mute');
              await interaction.reply({
                embeds: [ADD_MUTE_EMBED(member, time)],
                ephemeral: true,
              });
              setTimeout(() => {
                member.roles.remove(muteRole);
              }, muteDuration);
              break;
          }
      }
    } catch (e) {
      interaction.reply({
        embeds: [ERROR_EMBED(e.message)],
        ephemeral: true,
      });
    }
  },
};
