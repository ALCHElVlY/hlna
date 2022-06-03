/* eslint-disable no-unused-vars */
// Built-in imports
const { SlashCommandBuilder } = require('@discordjs/builders');

// External imports
const axios = require('axios');

// Internal imports
const { CRAFT_EMBED, ERROR_EMBED } = require('../../utility/Embeds');
const format = require('../../utility/format');
const { highlighted } = format.formatOptions;

String.prototype.toProperCase = function (opt_lowerCaseTheRest) {
  return (opt_lowerCaseTheRest ? this.toLowerCase() : this).replace(
    /(^|[\s\xA0])[^\s\xA0]/g,
    function (s) {
      return s.toUpperCase();
    },
  );
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('craft')
    .setDescription(
      'Calculates the total resource cost of crafting x amount of items.',
    )
    .setDefaultPermission(true)
    .addStringOption((option) =>
      option
        .setName('item')
        .setDescription('The name of the item to craft.')
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName('quantity')
        .setDescription('The quantity of the item to craft.')
        .setRequired(true),
    ),
  category: 'ARK',
  permissions: ['User'],
  async execute(interaction) {
    const itemName = interaction.options.getString('item')
      .toProperCase()
      .replace(/[s]$/gm, '')
      .replace('Mdsm', 'M.D.S.M.')
      .replace('Mrlm', 'M.R.L.M.')
      .replace('Mdsm', 'M.S.C.M.')
      .replace('Momi', 'M.O.M.I.');
    const itemQty = interaction.options.getInteger('quantity');

    // Send an API request to get the creature data
    const results = await axios.get(`${process.env.ITEMS}/${itemName}`, {
      headers: {
        Authorization: 'Bearer ' + process.env.API_KEY,
      },
    });

    try {
      return interaction.reply({
        embeds: [CRAFT_EMBED(results.data, itemQty)],
        ephemeral: true,
      });
    } catch (e) {
      if (e instanceof TypeError) {
        return interaction.reply({
          embeds: [
            ERROR_EMBED(
              [
                'Check the spelling of your search and try again.',
                `If this message appears again, no data exists in the database for \`${highlighted(
                  itemName,
                )}\`.`,
              ].join(' '),
            ),
          ],
          ephemeral: true,
        });
      }
    }
  },
};
