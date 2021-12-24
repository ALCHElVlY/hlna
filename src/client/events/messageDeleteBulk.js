module.exports = {
	name: 'messageDeleteBulk',
	once: false,
	run: async (client, messages) => {
		const messageIDArray = [];

		// Push the message IDs to an array
		// This is to check whether or not a deleted message contained a role menu
		messages.forEach(message => {
			messageIDArray.push(message.id);
		});
	},
};