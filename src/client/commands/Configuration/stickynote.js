/* eslint-disable no-unused-vars */
// Built-in imports
const { SlashCommandBuilder } = require('@discordjs/builders');

// Internal imports
const {
  STICKYNOTE_EMBED,
  SUCCESS_EMBED,
  ERROR_EMBED,
} = require('../../utility/embeds');
const client = require('../../index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stickynote')
    .setDescription('Create, clone, or edit an existing sticky note.')
    .addSubcommand((command) =>
      command
        .setName('create')
        .setDescription('Creates a sticky note from scratch.')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('The channel to send the embed to.')
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName('color')
            .setDescription(
              'The color of the sticky note. Can be a role mention or hex color code.',
            )
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription('The title of the sticky note.')
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName('description')
            .setDescription('The body of the stickynote.')
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName('image')
            .setDescription('The image to send with the stickynote.')
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName('footer')
            .setDescription('The footer of the stickynote.')
            .setRequired(false),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName('clone')
        .setDescription('Clone and resend an existing stickynote.')
        .addStringOption((option) =>
          option
            .setName('id')
            .setDescription('The message ID of the stickynote to clone.')
            .setRequired(true),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName('edit')
        .setDescription('Edit an existing stickynote.')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('The channel to send the embed to.')
            .setRequired(false))
        .addStringOption((option) =>
          option
            .setName('color')
            .setDescription(
              'The color of the sticky note. Can either be a hex color code or a role color.',
            )
            .setRequired(false))
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription('The title of the sticky note.')
            .setRequired(false))
        .addStringOption((option) =>
          option
            .setName('description')
            .setDescription('The body of the stickynote.')
            .setRequired(false))
        .addStringOption((option) =>
          option
            .setName('image')
            .setDescription('The image to send with the stickynote.')
            .setRequired(false))
        .addStringOption((option) =>
          option
            .setName('footer')
            .setDescription('The footer of the stickynote.')
            .setRequired(false)),
    )
    .setDefaultPermission(true),
  category: 'Configuration',
  permissions: ['Administrator'],
  async execute(interaction) {
    const { guild } = interaction;
    const subcommand = interaction.options.getSubcommand();
    const has_channel = interaction.options._hoistedOptions.find(
      (option) => option.name === 'channel') ? true : false;
    const channel = has_channel
      ? await client.channels.cache.get(
          interaction.options.getChannel('channel'),
        )
      : interaction.channel;
    const options = interaction.options._hoistedOptions;

    switch (subcommand) {
      case 'create':
        (async () => {
          // Handle if no elements are passed,
          // at least a stickynote color and description are required
          const embedDescription = interaction.options._hoistedOptions.find(
            (option) => option.name === 'description');
          const embedColor = interaction.options._hoistedOptions.find(
            (option) => option.name === 'color');
          if (!embedDescription) {
            return interaction.reply({
              embeds: [
                ERROR_EMBED('Must provide at least an embed description.'),
              ],
              ephemeral: true,
            });
          } else if (!embedColor) {
            return interaction.reply({
              embeds: [
                ERROR_EMBED('Must provide a color for the sticky note.'),
              ],
              ephemeral: true,
            });
          }

          try {
            await channel
              .send({
                embeds: [STICKYNOTE_EMBED(guild, options)],
              })
              .then(() => {
                interaction.reply({
                  embeds: [SUCCESS_EMBED('Creating sticky note...')],
                  ephemeral: true,
                });
              });
          } catch (e) {
            return interaction.reply({
              embeds: [ERROR_EMBED(e.message)],
              ephemeral: true,
            });
          }
        })();
        break;
      case 'clone':
        (async () => {
          if (interaction.user.id !== '499426339321937954') return;
          const messageToFetch = interaction.options.getString('id');
          const message = await interaction.channel.messages.fetch(
            messageToFetch,
          );
          console.log(message.embeds);

          // await STICKYNOTE_EMBED(guild, options);
        })();
        break;
      case 'edit':
        if (interaction.user.id !== '499426339321937954') return;
        console.log('Subcommand: edit');
        // await STICKYNOTE_EMBED(guild, options);
        break;
      default:
        throw Error('Invalid subcommand.');
    }
  },
};
