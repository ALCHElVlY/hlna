/* eslint-disable no-unused-vars */
// Built-in imports
const Discord = require('discord.js');

// External imports
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);

/**
 * The loadEvents function takes in a Discord
 * client as an argument and loads all of the required events.
 * @param {Discord.Client} client A Discord client
 * @returns {Promise<void>}
 */
async function loadEvents(client) {
  // Then we load events, which will include our message and ready event.
  const eventFiles = await readdir('./src/client/events/');
  console.log(`Loading a total of ${eventFiles.length} events.`);

  for (let i = 0; i < eventFiles.length; i++) {
    const eventName = eventFiles[i].split('.')[0];
    console.log(`Loading Event: ${eventName}`);
    const event = require(`../events/${eventFiles[i]}`);
    client.on(eventName, event.run.bind(null, client));
  }
}
module.exports = loadEvents;
