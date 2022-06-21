// External imports
import { GuildMember, TextChannel } from 'discord.js';

// Internal imports
import { DiscordClient, Event, Logger } from '../structures';

export default class GuildMemberRemoveEvent extends Event {
  constructor(client: DiscordClient) {
    super(client, 'guildMemberRemove');
  }

  public async run(member: GuildMember): Promise<void> {
    const logger = new Logger();
    const settings = this.client.settings.get(member.guild.id);
    if (settings.log_channels.length <= 0) return;

    // Determine if a log channel is set for the particular log type
    // If the channel is not found, do nothing
    const channel = settings.log_channels.find(
      (c: any) => c.log_type === 'member_joinleave',
    );
    const logChannel = channel
      ? this.client.channels.cache.get(channel.channel_id) as TextChannel
      : undefined;
    if (!logChannel) return;

    try {
      logger.Log(member, 'member_leave', logChannel);
    } catch (e) {
      console.log(e);
    }
  }
}
