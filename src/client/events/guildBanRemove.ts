// External imports
import { GuildBan } from 'discord.js';

// Internal imports
import { DiscordClient, Event } from '../structures';

export default class GuildBanRemoveEvent extends Event {
  constructor(client: DiscordClient) {
    super(client, 'guildBanRemove');
  }

  public async run(ban: GuildBan): Promise<void> {
    console.log(ban);
  }
}
