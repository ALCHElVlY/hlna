// Import the format options
const format = require('./format');
const {
	bold,
} = format.formatOptions;

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

	// Format the clone time to DD/HH/MM/SS
	client.calculate = (number) => {
		const days = Math.floor(number / 86400);
		const hours = Math.floor(number / 3600) % 24;
		const minutes = Math.floor(number / 60) % 60;
		const seconds = Math.round(number % 60);
		return [
			`${bold(days)}d ${bold(hours)}h`,
			`${bold(minutes)}m ${bold(seconds)}s`,
		].join(' ');
	};

	// Format the mute time to milliseconds
	client.formatMuteTime = (time) => {
		const duration = time.match(/(\d)/gm);
		const timeUnit = time.match(/(\D)/gim);

		// Determine the time unit
		switch (timeUnit[0]) {
		case 's':
			return (duration[0] * 1000);
		case 'm':
			return (duration[0] * (1000 * 60));
		case 'h':
			return (duration[0] * (1000 * 3600));
		case 'd':
			return (duration[0] * (1000 * 86400));
		case 'w':
			return (duration[0] * (1000 * 604800));
		default:
			throw new Error('Duration out of range. Accepted units are [s, m, h, d, w]');
		}
	};

	// Set the multiplier for the tekgen command
	client.set_multiplier = (radius) => {
		const multiplier_setting = [];
		switch (radius) {
		case 1:
			multiplier_setting.push('1');
			break;
		case 2:
			multiplier_setting.push('1.33');
			break;
		case 5:
			multiplier_setting.push('2.32');
			break;
		case 10:
			multiplier_setting.push('3.97');
			break;
		}

		// Return the multiplier
		const multiplier_toSet = multiplier_setting;
		return multiplier_toSet;
	};

	// Query the BattleMetrics API for ARK server info
	client.fetchServerData = async (server) => {
		const fetch = require('node-fetch');
		const { SERVER_EMBED } = require ('./Embeds');
		try {
			const match = server.match(/\d+/gm);
			const standardFilter = `${process.env.BM_API_STANDARD}${server}`;
			const freeBuildFilter = `${process.env.BM_API_GENESIS}${match}`;
			const GenServers = [
				'genone708',
				'genone706',
				'genone705',
			];

			// Check if the server is a standard server or freebuild(genesis) server
			if (GenServers.includes(server)) {
				return fetch(freeBuildFilter)
					.then((res) => res.json())
					.then(async (d) => SERVER_EMBED(d.data[0].attributes));
			}
			else {
				return fetch(standardFilter)
					.then((res) => res.json())
					.then(async (d) => SERVER_EMBED(d.data[0].attributes));
			}
		}
		catch (e) {
			console.log(e);
		}
	};

	client.awaitReply = async (interaction, question, limit = 60000) => {
		// Filter the message collector to only allow the interaction author
		const filter = m => {
			// If the message author is the interaction author, return true
			if (m.author.id === interaction.user.id) return true;
			// Else return false
			return false;
		};

		// Send the prompt to the user
		await interaction.channel.send({ content: question });

		try {
			const collected = await interaction.channel.awaitMessages({
				filter,
				max: 1,
				maxProcessed: 1,
				time: limit,
				errors: ['time'],
			});
			return collected.first();
		}
		catch (e) {
			return false;
		}
	};

	client.getMentions = async (message) => {
		let hasMention = false;
		const mentions = {
			userMention: null || '',
			roleMention: null || '',
			channelMention: null || '',
		};
		// Check if there are any user mentions in this message
		if (message.mentions.users.size === 0) {
			hasMention = false;
		}
		else {
			hasMention = true;
			const userMention = await message.mentions.users.first();
			console.log(userMention);
			mentions.userMention = userMention.id;
		}

		// Check if there are any role mentions in this message
		if (message.mentions.roles.size === 0) {
			hasMention = false;
		}
		else {
			hasMention = true;
			const roleMention = await message.mentions.roles.first();
			mentions.roleMention = roleMention.id;
		}

		// Check if there are any channel mentions in this message
		if (message.mentions.channels.size === 0) {
			hasMention = false;
		}
		else {
			hasMention = true;
			const channelMention = await message.mentions.channels.first();
			mentions.channelMention = channelMention.id;
		}

		// Check if the message contained any mentions
		switch (hasMention) {
		case true:
			return mentions;
		case false:
			return message.content;
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