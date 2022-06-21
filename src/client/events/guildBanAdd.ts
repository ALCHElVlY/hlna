// External imports
import { GuildBan } from 'discord.js';

// Internal imports
import { DiscordClient, Event } from '../structures';

export default class GuildBanAddEvent extends Event {
  constructor(client: DiscordClient) {
    super(client, 'guildBanAdd');
  }

  public async run(ban: GuildBan): Promise<void> {
    console.log(ban.guild.bans);
    const settings = this.client.settings.get(ban.guild.id);
    if (settings.log_channels <= 0) return;

    // Determine if a log channel is set for the particular log type
    // If the channel is not found, do nothing
    const channel = settings.log_channels.find(
      (c: any) => c.log_type === 'member_ban',
    );
    const logChannel = channel
      ? this.client.channels.cache.get(channel.channel_id)
      : undefined;
    if (!logChannel) return;

    /* try {
      logger.log([ban.user, ban.reason], logChannel, 'member_ban');
    } catch (e) {
      console.log(e);
    }*/
  }
}
