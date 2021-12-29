/* eslint-disable no-unused-vars */
// Import various classes from the discord.js library
const {
	MessageEmbed,
	MessageActionRow,
	MessageButton,
	MessageSelectMenu,
} = require('discord.js');

// Import the builders class from the discord.js library
const {
	// General formatting
	bold,
	italic,
	strikethrough,
	underscore,
	spoiler,
	quote,
	blockQuote,
	codeBlock,
	inlineCode,
	// Link formatting
	hyperlink,
	hideLinkEmbed,
	// Mention formatting
	userMention,
	memberNicknameMention,
	channelMention,
	roleMention,
} = require('@discordjs/builders');

// import the momentJS library
const moment = require('moment');


// Formatting of a usage string, example:
// Usage: `-cmd dosomething <arg1> <arg2>`
exports.usage = (ctx, cmds, args) => {
	return `Usage: \`${cmds.join(' ')} ${args.map(arg => `<${arg}>`).join(' ')}\``;
};

// Time formatting
exports.interval = i => i.format('HH:mm:ss', { trim: false });
exports.moment = moment;

// Centralised scheme for embeds to use in other structures.
exports.embed = () => new MessageEmbed()
	.setColor('#9fd1ff');
exports.row = () => new MessageActionRow();
exports.button = () => new MessageButton()
	.setStyle('PRIMARY');
exports.rolemenu = (options = []) => {
	const menu = new MessageSelectMenu()
		.setCustomId('role-menu')
		.setPlaceholder('Select a role')
		.setMinValues(0)
		.setMaxValues(options.length);

	// Loop through the options and add them to the menu
	for (const option of options) {
		menu.addOptions({
			label: option.role.name,
			description: `Add or remove the ${option.role.name} role`,
			value: option.role.name,
		});
	}

	return menu;
};

// Simple human-readable print
exports.prettyPrint = (value) => {
	if (value === undefined || value === null) return '`null`';
	if (Array.isArray(value)) return value.join(', ');
	switch(typeof (value)) {
	case 'boolean': return value ? 'Yes' : 'No';
	case 'object': return JSON.stringify(value, undefined, 2);
	default: return value.toString();
	}
};

// Export the builder classes
exports.formatOptions = {
	// General formatting
	bold,
	italic,
	strikethrough,
	underscore,
	spoiler,
	quote,
	blockQuote,
	codeBlock,
	inlineCode,
	highlighted: (text) => `\`${text}\``,
	// Link formatting
	hyperlink,
	hideLinkEmbed,
	// Mention formatting
	userMention,
	memberNicknameMention,
	channelMention,
	roleMention,
};