// External imports
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, TextChannel } from 'discord.js';

// Internal imports
import { DiscordClient, SlashCommand, RoleMenu } from '../../structures';
import { EmbedEnum } from '../../../enums';
const { ERROR_EMBED } = EmbedEnum;

export default class RoleMenuCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('rolemenu')
        .setDescription('Create a self-assignable role menu.')
        .setDefaultMemberPermissions(null)
        .addSubcommand((command) =>
          command
            .setName('setup')
            .setDescription('Setup a role menu')
            .addChannelOption((option) =>
              option
                .setName('channel')
                .setDescription('The channel to send the role menu to')
                .setRequired(false),
            ),
        )
        .addSubcommand((command) =>
          command
            .setName('edit')
            .setDescription('Edit the options of an existing role menu')
            .addStringOption((option) =>
              option
                .setName('id')
                .setDescription('The ID of the role menu to edit')
                .setRequired(true),
            ),
        ) as SlashCommandBuilder,
      category: 'Configuration',
      permissions: ['Server Owner'],
    });
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const rolemenu = new RoleMenu(this.client);
    const subcommand = interaction.options.getSubcommand();
    const channel = (interaction.options.getChannel('channel') ??
      interaction.channel) as TextChannel;
    const menuID = interaction.options.getString('id') ?? null;

    try {
      switch (subcommand) {
        case 'setup':
          await rolemenu.Setup(interaction, channel);
          break;
        case 'edit':
          console.log(menuID);
          break;
      }
    } catch (e: any) {
      return interaction.reply({
        embeds: [ERROR_EMBED(this.client, e.message)],
        ephemeral: true,
      });
    }
  }
}
