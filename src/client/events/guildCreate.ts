// External imports
import { Guild } from 'discord.js';

// Internal imports
import {
  DiscordClient,
  Event,
  AxiosPrivate,
  GuildSettings,
} from '../structures';
import { clientConfig } from '../../interfaces/env_config';

export default class GuildCreateEvent extends Event {
  constructor(client: DiscordClient) {
    super(client, 'guildCreate');
  }

  public async run(guild: Guild): Promise<void> {
    const guildsettings = new GuildSettings(this.client);

    AxiosPrivate.post(clientConfig.CONFIGURATION, { guild_id: guild.id })
      .then(() =>
        console.log('Guild Added', {
          Name: guild.name,
          ID: guild.id,
        }),
      )
      .catch((e: any) => console.log(e));

    // Add the new guild to the settings cache
    this.client.settings.set(guild.id, guildsettings.Defaults);
  }
}
