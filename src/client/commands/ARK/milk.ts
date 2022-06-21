// External imports
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

// Internal imports
import { DiscordClient, SlashCommand } from '../../structures';
import { EmbedEnum } from '../../../enums';
const { ERROR_EMBED, MILK_EMBED } = EmbedEnum;

export default class MilkCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('milk')
        .setDescription(
          'Calculates the time before you can feed a baby Wyvern again.',
        )
        .setDefaultMemberPermissions(null)
        .addIntegerOption((option) =>
          option
            .setName('food')
            .setDescription('The food level of the baby Wyvern')
            .setRequired(true),
        ) as SlashCommandBuilder,
      category: 'ARK',
      permissions: ['User'],
    });
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const food_level = interaction.options.getInteger('food') as number;

    // Set the multiplier and calulate the consumption rate.
    const multiplier = 10;
    const consumption_rate = food_level * multiplier;

    try {
      // Handle invalid fuel amount.
      if (food_level <= 0) {
        throw Error('Food level must be a positive number greater than 0.');
      }

      // Send the embed.
      interaction.reply({
        embeds: [MILK_EMBED(this.client, food_level, consumption_rate)],
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
