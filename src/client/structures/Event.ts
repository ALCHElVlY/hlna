// External imports
import { ClientEvents } from 'discord.js';

// Internal imports
import DiscordClient from './DiscordClient';

export default abstract class Event {
  readonly client: DiscordClient;
  readonly name: keyof ClientEvents;

  constructor(client: DiscordClient, name: keyof ClientEvents) {
    this.client = client;
    this.name = name;
  }

  abstract run(...params: any | undefined): Promise<any>;
}
