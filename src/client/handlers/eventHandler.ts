// Built-in imports
import { readdir } from 'node:fs/promises';

// External imports
import { Client } from 'discord.js';

/**
 * Loads the client event files required for the client.
 * @param {Client} client The Discord client
 */
async function loadEvents(client: Client): Promise<void> {
  // Then we load events, which will include our message and ready event.
  const eventFiles: string[] = await readdir('./src/client/events/');
  console.log(`Loading a total of ${eventFiles.length} events.`);

  for (let i = 0; i < eventFiles.length; i++) {
    const eventName: string = eventFiles[i].split('.')[0];
    console.log(`Loading Event: ${eventName}`);
    const event = require(`../events/${eventFiles[i]}`);
    client.on(eventName, event.run.bind(null, client));
  }
}
export default loadEvents;
