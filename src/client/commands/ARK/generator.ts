// External imports
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

// Internal imports
import { DiscordClient, SlashCommand } from '../../structures';
import { EmbedEnum } from '../../../enums';
const { ERROR_EMBED, GENERATOR_EMBED } = EmbedEnum;

export default class GeneratorCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('generator')
        .setDescription(
          'Calculates the time before a gas generator runs out of fuel.',
        )
        .setDefaultMemberPermissions(null)
        .addIntegerOption((option) =>
          option
            .setName('fuel')
            .setDescription('The amount of fuel in the generator')
            .setRequired(true),
        ) as SlashCommandBuilder,
      category: 'ARK',
      permissions: ['User'],
    });
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const fuel_amount = interaction.options.getInteger('fuel') as number;

    // Set the multiplier and calulate the consumption rate.
    const multiplier = 3600;
    const consumption_rate = fuel_amount * multiplier;

    try {
      // Handle invalid fuel amount.
      if (fuel_amount <= 0) {
        throw Error('Fuel amount must be a positive number greater than 0.');
      }

      // Send the embed.
      interaction.reply({
        embeds: [GENERATOR_EMBED(this.client, fuel_amount, consumption_rate)],
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
