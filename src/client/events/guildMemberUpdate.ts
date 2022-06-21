// External imports
import { GuildMember, TextChannel } from 'discord.js';

// Internal imports
import { DiscordClient, Event, Logger } from '../structures';

export default class GuildMemberUpdateEvent extends Event {
  constructor(client: DiscordClient) {
    super(client, 'guildMemberUpdate');
  }

  public async run(
    oldMember: GuildMember,
    newMember: GuildMember,
  ): Promise<void> {
    const logger = new Logger();
    const rolesAdded = newMember.roles.cache.filter(
      (r) => !oldMember.roles.cache.has(r.id),
    );
    const rolesRemoved = oldMember.roles.cache.filter(
      (r) => !newMember.roles.cache.has(r.id),
    );

    // If the member gained a role, log it
    if (rolesAdded.size > 0) {
      const guild = newMember.guild;
      const settings = this.client.settings.get(guild.id);
      if (settings.log_channels <= 0) return;

      // Determine if a log channel is set for the particular log type
      // If the channel is not found, do nothing
      const channel = settings.log_channels.find(
        (c: any) => c.log_type === 'role_add',
      );
      const logChannel = channel
        ? (this.client.channels.cache.get(channel.channel_id) as TextChannel)
        : undefined;
      if (!logChannel) return;

      try {
        rolesAdded.forEach((r) => {
          logger.Log([newMember, r], 'role_add', logChannel);
        });
      } catch (e) {
        console.log(e);
      }
    }

    // If the member lost a role, log it
    if (rolesRemoved.size > 0) {
      const guild = newMember.guild;
      const settings = this.client.settings.get(guild.id);
      if (settings.log_channels <= 0) return;

      // Determine if a log channel is set for the particular log type
      // If the channel is not found, do nothing
      const channel = settings.log_channels.find(
        (c: any) => c.log_type === 'role_remove',
      );
      const logChannel = channel
        ? (this.client.channels.cache.get(channel.channel_id) as TextChannel)
        : undefined;
      if (!logChannel) return;

      try {
        rolesRemoved.forEach((r) => {
          logger.Log([newMember, r], 'role_remove', logChannel);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
}
