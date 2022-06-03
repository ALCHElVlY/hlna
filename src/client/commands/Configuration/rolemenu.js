/* eslint-disable no-unused-vars */
// Built-in imports
const { SlashCommandBuilder } = require('@discordjs/builders');

// Internal imports
const { ERROR_EMBED } = require('../../utility/embeds');
const RoleMenu = require('../../structures/RoleMenu');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rolemenu')
    .setDescription('Create a self-assignable role menu.')
    .addSubcommand((command) =>
      command
        .setName('setup')
        .setDescription('Setup a role menu.')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('The channel to send the role menu to.')
            .setRequired(false),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName('edit')
        .setDescription('Edit the options of an existing role menu.')
        .addStringOption((option) =>
          option
            .setName('id')
            .setDescription('The ID of the role menu to edit.')
            .setRequired(true),
        ),
    )
    .setDefaultPermission(true),
  category: 'Configuration',
  permissions: ['Server Owner'],
  async execute(interaction) {
    const rolemenu = new RoleMenu();
    const subcommand = interaction.options.getSubcommand();
    const channel =
      interaction.options._hoistedOptions.length > 0
        ? interaction.options.getChannel('channel')
        : interaction.channel;
    const menuID =
      interaction.options._hoistedOptions.length > 0
        ? interaction.options.getString('id')
        : null;

    try {
      switch (subcommand) {
        case 'setup':
          await rolemenu.setup(channel, interaction);
          break;
        case 'edit':
          console.log(menuID);
          break;
      }
    } catch (e) {
      return interaction.reply({
        embeds: [ERROR_EMBED(e.message)],
        ephemeral: true,
      });
    }
  },
};
