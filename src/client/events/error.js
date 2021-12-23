module.exports = {
	name: 'error',
	once: false,
	run: async (client, error) => {
		console.log(error);
	},
};