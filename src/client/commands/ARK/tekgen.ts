// External imports
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

// Internal imports
import { DiscordClient, SlashCommand } from '../../structures';
import ClientFunctions from '../../utils/functions';
import { EmbedEnum } from '../../../enums';
const { ERROR_EMBED, TEKGEN_EMBED } = EmbedEnum;

export default class TekgenCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('tekgen')
        .setDescription(
          'Calculates the time before a tek generator runs out of fuel.',
        )
        .setDefaultMemberPermissions(null)
        .addIntegerOption((option) =>
          option
            .setName('element')
            .setDescription('The amount of element in the tek generator')
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName('radius')
            .setDescription('The radius setting of the tek generator.')
            .setRequired(true)
            .addChoices(
              { name: '1', value: 1 },
              { name: '2', value: 2 },
              { name: '5', value: 5 },
              { name: '10', value: 10 },
            ),
        ) as SlashCommandBuilder,
      category: 'ARK',
      permissions: ['User'],
    });
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const element = interaction.options.getInteger('element') as number;
    const radius = interaction.options.getInteger('radius') as number;

    // Set the multiplier and calulate the consumption rate.
    const multiplier = ClientFunctions.SetMultiplier(radius);
    const consumption_rate = (element / multiplier) * 18 * 3600;

    try {
      // Handle invalid fuel amount.
      if (element <= 0) {
        throw Error('Element must be a positive number greater than 0.');
      }

      // Send the embed.
      interaction.reply({
        embeds: [TEKGEN_EMBED(this.client, element, radius, consumption_rate)],
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
