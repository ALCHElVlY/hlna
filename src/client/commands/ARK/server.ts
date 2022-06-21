// External imports
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

// Internal imports
import { DiscordClient, SlashCommand } from '../../structures';
import ClientFunctions from '../../utils/functions';
import { EmbedEnum } from '../../../enums';
const { ERROR_EMBED } = EmbedEnum;

export default class ServerCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('server')
        .setDescription(
          'Query the battlemetrics API for ARK Official server info.',
        )
        .setDefaultMemberPermissions(null)
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('The name of the server to search for')
            .setRequired(true),
        ) as SlashCommandBuilder,
      category: 'ARK',
      permissions: ['User'],
    });
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const value = interaction.options.getString('name') as string;
    const data = await ClientFunctions.FetchServerData(this.client, interaction, value);

    try {
      // Send the embed.
      interaction.reply({
        embeds: [data],
        ephemeral: true,
      });
    } catch (e: any) {
      return interaction.reply({
        embeds: [ERROR_EMBED(this.client, e.message)],
        ephemeral: true,
      });
    }
  }
}
