// External imports
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, version } from 'discord.js';

// Internal imports
import { DiscordClient, SlashCommand } from '../../structures';
import { EmbedEnum } from '../../../enums';
import moment from 'moment';
import 'moment-duration-format';
const { ERROR_EMBED, STATS_EMBED } = EmbedEnum;

export default class StatsCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Gives some useful bot statistics.')
        .setDefaultMemberPermissions(null) as SlashCommandBuilder,
      category: 'General',
      permissions: ['User'],
    });
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const duration = moment
      .duration(this.client.uptime)
      .format(' D [days], H [hrs], m [mins], s [secs]');

    try {
      return interaction.reply({
        embeds: [STATS_EMBED(this.client, duration, version)],
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
