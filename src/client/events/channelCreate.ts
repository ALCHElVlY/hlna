// External imports
import { GuildChannel } from 'discord.js';

// Internal imports
import { DiscordClient, Event } from '../structures';

export default class ChannelCreateEvent extends Event {
  constructor(client: DiscordClient) {
    super(client, 'channelCreate');
  }

  public async run(channel: GuildChannel): Promise<void> {
    console.log(channel);
  }
}
