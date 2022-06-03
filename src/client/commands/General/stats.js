/* eslint-disable no-unused-vars */
// Built-in imports
const { SlashCommandBuilder } = require('@discordjs/builders');
const { version } = require('discord.js');

// External imports
const moment = require('moment');
require('moment-duration-format');

// Import the embed builders
const {
	STATS_EMBED,
	ERROR_EMBED,
} = require('../../utility/embeds');
const client = require('../../index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Gives some useful bot statistics.')
    .setDefaultPermission(true),
  category: 'General',
  permissions: ['User'],
  async execute(interaction) {
    const duration = moment
      .duration(client.uptime)
      .format(' D [days], H [hrs], m [mins], s [secs]');

    try {
      return interaction.reply({
        embeds: [STATS_EMBED(duration, version)],
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
