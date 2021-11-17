require('dotenv').config();
const axios = require('axios');

module.exports = {
	name: 'messageDelete',
	once: false,
	run: async (client, message) => {
		const settings = client.settings.get(message.guild.id);
		const channelIDs = [];
		for (const channel of settings.tradeChannels) {
			channelIDs.push(channel.channelID);
		}
		const matchTradeCh = channelIDs.includes(message.channel.id);
		switch (matchTradeCh) {
		case true:
			(async () => {
				// Get the user's transactions
				const userTransactions = await axios.get(`${process.env.USERS}/${message.author.id}/transactions`);
				if (!userTransactions.data.length) return;
				// Loop through the userTransactions and check if the deleted message was a transaction
				for (const transaction of userTransactions.data) {
					if (transaction.messageID === message.id) {
						// Delete the transaction
						await axios.delete(`${process.env.USERS}/${message.author.id}/transactions/${transaction.transaction_id}`);
					}
					else {
						return;
					}
				}
			})();
			break;
		case false:
			// Do nothing
			break;
		}
	},
};