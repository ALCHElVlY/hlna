// Import format.js
const format = require('../../../utility/format.js').formatOptions;
const axios = require('axios');

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
			console.log('add');
			break;
		case 'remove':
			console.log('remove');
			break;
		default:
			throw Error('Invalid action!');
		}
	}
};

module.exports = configWorker_logs;