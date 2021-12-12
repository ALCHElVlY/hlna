// Import format.js
const format = require('../../../utility/format.js').formatOptions;
const axios = require('axios');

const configWorker_prefix = async (client, interaction) => {
	// The settings for this guild
	const settings = client.settings.get(interaction.guild.id);

	// Prompt the user for the new prefix
	const response = await client.awaitReply(
		interaction,
		'What would you like the new prefix to be?',
	);

	if (response) {
		const { guild } = interaction;
		const newSetting = {
			key: 'prefix',
			value: response.content,
		};

		// Send an API request to update the database
		await axios.put(`${process.env.CONFIGURATION}/${guild.id}`, {
			key: newSetting.key,
			value: newSetting.value,
		});

		// Update the key in the guild settings
		settings[`${newSetting.key}`] = newSetting.value;

		// Send a confirmation message
		interaction.channel.send(
			`The new prefix is now ${format.highlighted(newSetting.value)}`);
	}
};

module.exports = configWorker_prefix;