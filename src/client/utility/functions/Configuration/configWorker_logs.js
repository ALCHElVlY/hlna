// Import format.js
const format = require('../../../utility/format.js');
const axios = require('axios');
const channelIDRegex = new RegExp(/(\d+)/gm);

// Import the format options
const {
	channelMention,
} = format.formatOptions;

const configWorker_logs = async (client, interaction, response) => {
	// Await for the user response
	response = await client.awaitReply(
		interaction,
		'Would you like to `add` or `remove` a log channel?',
	);

	if (response) {
		const action = response.content;
		switch (action) {
		case 'add':
			await configWorker_add_log(client, interaction);
			break;
		case 'remove':
			console.log('remove');
			break;
		default:
			throw Error('Invalid action!');
		}
	}
};

const configWorker_add_log = async (client, interaction) => {
	// The settings for this guild
	const settings = client.settings.get(interaction.guild.id).log_channels;
	const log_types = [
		'`MEMBER_JOINLEAVE`',
		'`ROLE_ADD`',
		'`ROLE_REMOVE`',
		'`MESSAGES`',
	];


	// Await for the user response
	const response = await client.awaitReply(
		interaction,
		[
			'Enter a channel and the log type you would like to add',
			`Acceptable log types are: [${log_types.join(', ')}]`,
		].join('\n'),
	);

	if (response) {
		const content = response.content.split(' ');
		const channelID = content[0].match(channelIDRegex)[0];
		const channel = client.channels.cache.get(channelID);
		const logChData = {
			channel_id: channelID,
			channel_name: channel.name,
			log_type: content[1],
		};
		console.log(logChData);
	}
};

const configWorker_remove_log = async (client, interaction) => {};

module.exports = configWorker_logs;