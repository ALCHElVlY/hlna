// Built-in imports
const Discord = require('discord.js'); // JSDoc reference only

// Internal imports
const format = require('../../../utility/format.js').formatOptions;
const { axiosPrivate } = require('../../Axios');

const update = async (client, interaction, roleSetting) => {
  // The settings for this guild
  const settings = client.settings.get(interaction.guild.id).roles;
  // Await for the user response
  const response = await client.awaitReply(
    interaction,
    'Enter the new value for this role',
  );

  if (response) {
    const hasMention = await client.getMentions(response);
    const { guild } = interaction;
    const newSetting = {
      key: roleSetting,
      value: '',
    };

    // If the response has a mention, then it is a role mention
    // Otherwise, it is a role ID
    switch (typeof hasMention) {
      case 'string':
        newSetting.value = hasMention;
        break;
      case 'object':
        newSetting.value = hasMention.roleMention;
        break;
    }

    // Send an API request to update the database
    await axiosPrivate.put(`${process.env.CONFIGURATION}/${guild.id}`,
      {
        key: `roles.${roleSetting}`,
        value: newSetting.value,
      });

    // Update the key in the guild settings
    settings[`${newSetting.key}`] = newSetting.value;

    // Send a confirmation message
    return await interaction.channel.send(
      `${client.findEmoji('greenCheckBox')} ${format.highlighted(
        roleSetting,
      )} setting ` +
        `has been updated to ${format.highlighted(newSetting.value)}`,
    );
  }
};

/**
 * The settings_roles function handles updating the roles for the guild
 * profile in the database.
 * @param {Discord.Client} client The discord client
 * @param {Discord.Interaction} interaction A discord interaction
 * @param {*} response callback function
 */
const settings_roles = async (client, interaction, response) => {
  // Await for the user response
  response = await client.awaitReply(
    interaction,
    'Which role would you like to edit?',
  );

  if (response) {
    const role = response.content;
    switch (role) {
      case 'admin_role':
        await update(client, interaction, role);
        break;
      case 'dev_role':
        await update(client, interaction, role);
        break;
      case 'mod_role':
        await update(client, interaction, role);
        break;
      case 'verified_role':
        await update(client, interaction, role);
        break;
      case 'mute_role':
        await update(client, interaction, role);
        break;
      default:
        console.log('Error: role not found in the guild settings!');
    }
  }
};

module.exports = settings_roles;
