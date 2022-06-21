// External imports
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

// Internal imports
import { AxiosPrivate, DiscordClient, SlashCommand } from '../../structures';
import ClientFunctions from '../../utils/functions';
import { clientConfig } from '../../../interfaces/env_config';
import { EmbedEnum } from '../../../enums';
const { ERROR_EMBED, CRAFT_EMBED } = EmbedEnum;

export default class CraftCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('craft')
        .setDescription(
          'Calculates the total resource cost of crafting x amount of items.',
        )
        .setDefaultMemberPermissions(null)
        .addStringOption((option) =>
          option
            .setName('item')
            .setDescription('The name of the item to craft')
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName('quantity')
            .setDescription('The quantity of the item to craft')
            .setRequired(true),
        ) as SlashCommandBuilder,
      category: 'ARK',
      permissions: ['User'],
    });
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const itemName = interaction.options.getString('item') as string;
    const ItemName = ClientFunctions.ToProperCase(itemName)
      .replace(/[s]$/gm, '')
      .replace('Mdsm', 'M.D.S.M.')
      .replace('Mrlm', 'M.R.L.M.')
      .replace('Mdsm', 'M.S.C.M.')
      .replace('Momi', 'M.O.M.I.');
    const itemQty = interaction.options.getInteger('quantity') as number;

    // Send an API request to get the creature data
    const results = await AxiosPrivate.get(`${clientConfig.ITEMS}/${ItemName}`);

    try {
      return interaction.reply({
        embeds: [CRAFT_EMBED(this.client, results.data, itemQty)],
        ephemeral: true,
      });
    } catch (e: any) {
      if (e instanceof TypeError) {
        return interaction.reply({
          embeds: [
            ERROR_EMBED(
              this.client,
              [
                'Check the spelling of your search and try again.',
                'If this message appears again, no data exists in ',
                `the database for ${ClientFunctions.HighLight(itemName)}.`,
              ].join(' '),
            ),
          ],
          ephemeral: true,
        });
      }
    }
  }
}
