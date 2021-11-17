require('dotenv').config();
// const format = require('../utils/format');

module.exports = (client) => {
	// Function to search the client for an emoji provided by the user either
	// as a customEmoji or a unicodeEmoji
	client.findEmoji = (ctx) => {
		try {
			const customEmoji = client.emojis.cache.find(e => e.name === `${ctx}`);
			if (!customEmoji || customEmoji === undefined) return client.emojis.cache.get(ctx);
			return customEmoji.toString();
		}
		catch (e) {
			console.log(e);
		}
	};

	client.awaitReply = async (msg, question, limit = 60000) => {
		const filter = m => m.author.id === msg.author.id;
		await msg.reply({ content: question });
		try {
			const collected = await msg.channel.awaitMessages({
				filter,
				max: 1,
				maxProcessed: 1,
				time: limit,
				errors: ['time'],
			});
			return collected.first().content;
		}
		catch (e) {
			return false;
		}
	};

	client.awaitConfirmation = async (message, content) => {
		const response = await client.awaitReply(message, content + ' (yes/no)');
		return ['y', 'yes'].includes(response);
	};

	client.loadCommand = (file) => {
		const commandName = file.replace(/\w+\\/gm, '').split('.')[0];
		try {
			console.log(`Loading Command: ${commandName}`);
			const props = require(`../${file}`);
			client.commands.set(commandName, props);
			props.aliases.forEach(alias => client.aliases.set(alias, commandName));
			return false;
		}
		catch (e) {
			return console.error(`Unable to load command ${commandName}: ${e}`);
		}
	};

	// `await client.wait(1000);` to "pause" for 1 second.
	client.wait = require('util').promisify(setTimeout);

	// These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
	process.on('uncaughtException', (err) => {
		const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
		console.error(`Uncaught Exception: ${errorMsg}`);
		process.exit(1);
	});

	process.on('unhandledRejection', err => {
		console.error(`Unhandled rejection: ${err}`);
	});
};