/* eslint-disable no-unused-vars */
// Built-in imports
const { SlashCommandBuilder } = require('@discordjs/builders');

// Internal imports
const { ERROR_EMBED } = require('../../utility/embeds');
const client = require('../../index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Query the battlemetrics API for ARK Official server info.')
    .setDefaultPermission(true)
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('The name of the server to search for.')
        .setRequired(true),
    ),
  category: 'ARK',
  permissions: ['User'],
  async execute(interaction) {
    const value = interaction.options.getString('name');
    const data = await client.fetchServerData(value);

    try {
      // Send the embed.
      interaction.reply({
        embeds: [data],
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
