// External imports
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

// Internal imports
import { AxiosPrivate, DiscordClient, SlashCommand } from '../../structures';
import ClientFunctions from '../../utils/functions';
import { clientConfig } from '../../../interfaces/env_config';
import { EmbedEnum } from '../../../enums';
const { ERROR_EMBED, CLONE_EMBED } = EmbedEnum;

export default class CloneCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('clone')
        .setDescription('Calculates the time and cost of cloning a creature.')
        .setDefaultMemberPermissions(null)
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('The name of the creature to clone')
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName('level')
            .setDescription('The level of the creature being cloned')
            .setRequired(true),
        ) as SlashCommandBuilder,
      category: 'ARK',
      permissions: ['User'],
    });
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const creatureName = interaction.options.getString('name') as string;
    const CreateName = ClientFunctions.ToProperCase(creatureName) as string;
    const level = interaction.options.getInteger('level') as number;
    const OfficialRates = await ClientFunctions.GetOfficialRates();
    const mature_rate = await OfficialRates.get('BabyMatureSpeedMultiplier');

    // Send an API request to get the creature data
    const results = await AxiosPrivate.get(
      `${clientConfig.DOSSIER}/${CreateName}`,
    );

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
          `${ClientFunctions.HighLight(CreateName)} not found in the database.`,
        );
      }

      // Send the embed
      return interaction.reply({
        embeds: [
          CLONE_EMBED(
            this.client,
            creatureName,
            level,
            clone_cost,
            clone_time,
            mature_rate,
          ),
        ],
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
