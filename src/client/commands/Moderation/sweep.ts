// External imports
import { channelMention, SlashCommandBuilder } from '@discordjs/builders';
import {
  CommandInteraction,
  TextChannel,
} from 'discord.js';

// Internal imports
import { DiscordClient, SlashCommand, Logger } from '../../structures';
import { EmbedEnum } from '../../../enums';
const { SUCCESS_EMBED, ERROR_EMBED } = EmbedEnum;

export default class SweepCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('sweep')
        .setDescription('Bulk delete x amount of messages from a channel.')
        .setDefaultMemberPermissions(null)
        .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('The amount of messages to delete')
        .setRequired(true),
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel to delete messages from')
        .setRequired(false),
    ) as SlashCommandBuilder,
      category: 'Moderation',
      permissions: ['Moderator'],
    });
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const logger = new Logger();
    const settings = this.client.settings.get(interaction.guild?.id);
    const amount = interaction.options.getInteger('amount') as number;
    let channel = interaction.options.getChannel('channel') as TextChannel
      ?? undefined;

    try {
      // Handle if the amount is less than 1, or greater than 100
      if (amount < 1 || amount > 100) {
        return interaction.reply({
          embeds: [ERROR_EMBED(this.client, 'Amount must be between 1 and 100.')],
          ephemeral: true,
        });
      }

      // Handle if a channel was provided in the options or not
      if (!channel) {
        channel = interaction.channel as TextChannel;
        // Delete the messages
        await channel.bulkDelete(amount, true);

        // Send a success message
        await interaction.reply({
          embeds: [
            SUCCESS_EMBED(
              this.client,
              `${amount} messages have were deleted from this channel.`,
            ),
          ],
          ephemeral: true,
        });

        // If there is no log channel set, do nothing
        if (settings.log_channels.length <= 0) return;

        // Find the log channel for MESSAGE_BULK_DELETE
        const channelID = settings.log_channels.find(
          (c: any) => c.log_type === 'message_bulk_delete',
        ).channel_id;
        const logChannel = this.client.channels.cache.get(channelID) as TextChannel;

        // If the channel is not found, do nothing
        if (!logChannel) return;
        try {
          return logger.Log(
            [interaction, amount],
            'message_bulk_delete',
            logChannel,
          );
        } catch (e) {
          console.log(e);
        }
      } else {
        // Delete the messages
        await channel.bulkDelete(amount, true);

        // Send a success message
        await interaction.reply({
          embeds: [
            SUCCESS_EMBED(
              this.client,
              `${amount} messages were deleted from ${channelMention(
                channel.id,
              )}.`,
            ),
          ],
          ephemeral: true,
        });

        // If there is no log channel set, do nothing
        if (settings.log_channels.length <= 0) return;

        // Find the log channel for MESSAGE_BULK_DELETE
        const channelID = settings.log_channels.find(
          (c: any) => c.log_type === 'message_bulk_delete',
        ).channel_id;
        const logChannel = this.client.channels.cache.get(channelID) as TextChannel;

        // If the channel is not found, do nothing
        if (!logChannel) return;
        try {
          await logger.Log(
            [interaction, amount],
            'message_bulk_delete',
            logChannel,
          );
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e: any) {
      const noLogChannelError =
        "Cannot read properties of undefined (reading 'channel_id')";
      if (e.message === noLogChannelError) return;
      return await interaction.reply({
        embeds: [ERROR_EMBED(this.client, e.message)],
        ephemeral: true,
      });
    }
  }
}
