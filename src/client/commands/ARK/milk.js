/* eslint-disable no-unused-vars */
// Built-in imports
const { SlashCommandBuilder } = require('@discordjs/builders');

// Internal imports
const { MILK_EMBED, ERROR_EMBED } = require('../../utility/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('milk')
    .setDescription(
      'Calculates the time before you can feed a baby Wyvern again.',
    )
    .setDefaultPermission(true)
    .addIntegerOption((option) =>
      option
        .setName('food')
        .setDescription('The food level of the baby Wyvern.')
        .setRequired(true),
    ),
  category: 'ARK',
  permissions: ['User'],
  async execute(interaction) {
    const value = interaction.options.getInteger('food');

    // Set the multiplier and calulate the consumption rate.
    const multiplier = 10;
    const food_level = value;
    const consumption_rate = food_level * multiplier;

    try {
      // Handle invalid fuel amount.
      if (food_level <= 0) {
        throw Error('Food level must be a positive number greater than 0.');
      }

      // Send the embed.
      interaction.reply({
        embeds: [MILK_EMBED(food_level, consumption_rate)],
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
