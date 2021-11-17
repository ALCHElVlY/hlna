require('dotenv').config();
const axios = require('axios');

module.exports = {
	name: 'channelDelete',
	once: false,
	run: async (client, channel) => {
		// Do nothing
		return;
	},
};