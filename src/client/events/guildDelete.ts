// External imports
import { Guild } from 'discord.js';

// Internal imports
import { DiscordClient, Event, AxiosPrivate } from '../structures';
import { clientConfig } from '../../interfaces/env_config';

export default class GuildDeleteEvent extends Event {
  constructor(client: DiscordClient) {
    super(client, 'guildDelete');
  }

  public async run(guild: Guild): Promise<void> {
    AxiosPrivate.delete(clientConfig.CONFIGURATION, {
      data: { guild_id: guild.id },
    })
      .then(() =>
        console.log('Guild Removed', {
          Name: guild.name,
          ID: guild.id,
        }),
      )
      .catch((e: any) => console.log(e));

    // Remove the guild from the settings cache
    this.client.settings.delete(guild.id);
  }
}
