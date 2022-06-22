// External imports
import { Collection } from 'discord.js';

// Internal imports
import { DiscordClient, AxiosPrivate, Event } from '../structures';
import ClientFunctions from '../utils/functions';
import { ICachedSettings } from '../utils/interfaces';
import { clientConfig } from '../../interfaces/env_config';

export default class ReadyEvent extends Event {
  constructor(client: DiscordClient) {
    super(client, 'ready');
  }

  public async run(): Promise<void> {
    console.log(`${this.client.user?.tag} has successfully connected!`);
    ClientFunctions.Sleep(1000);

    const res = await AxiosPrivate.get(clientConfig.CONFIGURATION);
    const cache = new Collection<any, any>();

    // loop through the array to sort the data
    res.data.forEach((entry: any) => {
      const toCache: ICachedSettings = entry;
      cache.set(entry.guild_id, toCache);
      this.client.settings = cache;
    });

    ClientFunctions.RefreshGameStatus(this.client);
  }
}
