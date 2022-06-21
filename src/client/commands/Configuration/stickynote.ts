// External imports
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Guild, Message, TextChannel } from 'discord.js';

// Internal imports
import { DiscordClient, SlashCommand } from '../../structures';
import { EmbedEnum } from '../../../enums';
const { SUCCESS_EMBED, ERROR_EMBED, STICKYNOTE_EMBED } = EmbedEnum;

export default class StickynoteCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('stickynote')
        .setDescription('Create, clone, or edit an existing sticky note.')
        .setDefaultMemberPermissions(null)
        .addSubcommand((command) =>
          command
            .setName('create')
            .setDescription('Creates a sticky note from scratch')
            .addChannelOption((option) =>
              option
                .setName('channel')
                .setDescription('The channel to send the embed to')
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName('color')
                .setDescription(
                  'The color of the sticky note. Can be a role mention or hex color code',
                )
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName('title')
                .setDescription('The title of the sticky note')
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName('description')
                .setDescription('The body of the stickynote')
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName('image')
                .setDescription('The image to send with the stickynote')
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName('footer')
                .setDescription('The footer of the stickynote')
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
                .setDescription('The message ID of the stickynote to clone')
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
                .setDescription('The channel to send the embed to')
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName('color')
                .setDescription(
                  'The color of the sticky note. Can either be a hex color code or a role color',
                )
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName('title')
                .setDescription('The title of the sticky note')
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName('description')
                .setDescription('The body of the stickynote')
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName('image')
                .setDescription('The image to send with the stickynote')
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName('footer')
                .setDescription('The footer of the stickynote')
                .setRequired(false),
            ),
        ) as SlashCommandBuilder,
      category: 'Configuration',
      permissions: ['Administrator'],
    });
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const guild = interaction?.guild as Guild;
    const subcommand = interaction.options.getSubcommand();
    const has_channel: boolean =
      interaction.options.getChannel('channel') !== null ? true : false;
    const channel = has_channel
      ? (this.client.channels.cache.get(
          interaction.options.getChannel('channel')?.id as string,
        ) as TextChannel)
      : (interaction.channel as TextChannel);
    const options = interaction.options;

    switch (subcommand) {
      case 'create':
        (async () => {
          // Handle if no elements are passed,
          // at least a stickynote color and description are required
          const embedDescription = interaction.options.getString('description');
          const embedColor = interaction.options.getString('color');
          if (!embedDescription) {
            return interaction.reply({
              embeds: [
                ERROR_EMBED(
                  this.client,
                  'Must provide at least an embed description.',
                ),
              ],
              ephemeral: true,
            });
          } else if (!embedColor) {
            return interaction.reply({
              embeds: [
                ERROR_EMBED(
                  this.client,
                  'Must provide a color for the sticky note.',
                ),
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
                  embeds: [
                    SUCCESS_EMBED(this.client, 'Creating sticky note...'),
                  ],
                  ephemeral: true,
                });
              });
          } catch (e: any) {
            return interaction.reply({
              embeds: [ERROR_EMBED(this.client, e.message)],
              ephemeral: true,
            });
          }
        })();
        break;
      case 'clone':
        (async () => {
          if (interaction.user.id !== '499426339321937954') return;
          const messageToFetch = interaction.options.getString('id') as string;
          const message = (await interaction.channel?.messages.fetch(
            messageToFetch,
          )) as Message;
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
  }
}
