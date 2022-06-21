// External imports
import { GuildChannel } from 'discord.js';

// Internal imports
import { DiscordClient, Event } from '../structures';

export default class ChannelDeleteEvent extends Event {
  constructor(client: DiscordClient) {
    super(client, 'channelDelete');
  }

  public async run(channel: GuildChannel): Promise<void> {
    console.log(channel);
  }
}
