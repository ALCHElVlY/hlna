// External imports
const axios = require('axios');

module.exports = {
  name: 'guildCreate',
  once: false,
  run: async (client, guild) => {
    // Send an API request to remove the guild from the database
    axios
      .delete(process.env.CONFIGURATION, {
        headers: { Authorization: 'Bearer ' + process.env.API_KEY },
        data: { guild_id: guild.id },
      })
      .then(() =>
        console.log('Guild Removed', {
          Name: guild.name,
          ID: guild.id,
        }),
      )
      .catch((e) => console.error(e));

    // Remove the guild from the settings cache
    client.settings.delete(guild.id);
  },
};
