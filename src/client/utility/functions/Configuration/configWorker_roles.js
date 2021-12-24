// Import format.js
const format = require('../../../utility/format.js').formatOptions;
const axios = require('axios');

const configWorker_roles = async (client, interaction, response) => {
	// Await for the user response
	response = await client.awaitReply(
		interaction,
		'Which role would you like to edit?',
	);

	if (response) {
		const role = response.content;
		switch (role) {
		case 'admin_role':
			await configWorker_role_update(client, interaction, role);
			break;
		case 'dev_role':
			await configWorker_role_update(client, interaction, role);
			break;
		case 'mod_role':
			await configWorker_role_update(client, interaction, role);
			break;
		case 'verified_role':
			await configWorker_role_update(client, interaction, role);
			break;
		case 'mute_role':
			await configWorker_role_update(client, interaction, role);
			break;
		default:
			console.log('Error: role not found in the guild settings!');
		}
	}
};

const configWorker_role_update = async (client, interaction, roleSetting) => {
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
		await axios.put(`${process.env.CONFIGURATION}/${guild.id}`, {
			key: `roles.${roleSetting}`,
			value: newSetting.value,
		}, { headers: { 'Authorization': 'Bearer ' + process.env.API_KEY } });

		// Update the key in the guild settings
		settings[`${newSetting.key}`] = newSetting.value;

		// Send a confirmation message
		await interaction.channel.send(
			`${client.findEmoji('greenCheckBox')} ${format.highlighted(roleSetting)} setting ` +
			`has been updated to ${format.highlighted(newSetting.value)}`,
		);
	}
};

module.exports = configWorker_roles;