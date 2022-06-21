// Built-in imports
import { Client, Collection } from 'discord.js';

interface DiscordClient {
    client: Client;
    commands: Collection<unknown, unknown>;
    settings: Collection<unknown, unknown>;
  }

/**
 * The loadMaps function takes in a Discord client and loads
 * all the necessary Collections and Maps.
 * @param {DiscordClient} client A Discord client.
 */
async function loadMaps(client: DiscordClient): Promise<void> {
  // A Collection to store the bots commands
  client.commands = new Collection();

  // A Collection to store the guild configurable settings
  client.settings = new Collection();
}
export default loadMaps;
