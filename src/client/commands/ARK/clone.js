/* eslint-disable no-unused-vars */
// Built-in imports
const { SlashCommandBuilder } = require('@discordjs/builders');

// External imports

// Internal imports
const { CLONE_EMBED, ERROR_EMBED } = require('../../utility/Embeds');
const _getOfficialRates = require('../../utility/functions/getOfficialRates');
const format = require('../../utility/format');
const { highlighted } = format.formatOptions;
const { axiosPrivate } = require('../../utility/Axios');

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
    .setName('clone')
    .setDescription('Calculates the time and cost of cloning a creature.')
    .setDefaultPermission(true)
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('The name of the creature to clone.')
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName('level')
        .setDescription('The level of the creature being cloned.')
        .setRequired(true),
    ),
  category: 'ARK',
  permissions: ['User'],
  async execute(interaction) {
    const creatureName =
      interaction.options.getString('name').toProperCase();
    const level = interaction.options.getInteger('level');
    const OfficialRates = await _getOfficialRates();
    const mature_rate = await OfficialRates.get('BabyMatureSpeedMultiplier');

    // Send an API request to get the creature data
    const results = await axiosPrivate.get(`${process.env.DOSSIER}/${creatureName}`);

    try {
      // Calculate the total time and cost to clone the creature
      const BaseElementCost = results.data.base_cost;
      const CostPerLevel = results.data.per_level_cost;
      const CostForLevel = level * CostPerLevel;
      const clone_cost = CostForLevel + BaseElementCost;
      const clone_time = clone_cost * (7 / mature_rate);

      // Handle if the creature is not found
      if (results.data === null) {
        throw new Error(
          `${highlighted(creatureName)} not found in the database.`,
        );
      }

      // Send the embed
      interaction.reply({
        embeds: [
          CLONE_EMBED(creatureName, level, clone_cost, clone_time, mature_rate),
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
