require('dotenv').config();
const client = require('../../client/index');
const format = require('../../client/utility/format.js');

const ERROR_EMBED = (error) => {
	const { highlighted } = format.formatOptions;
	const errorEmoji = client.findEmoji('redX');
	// Format the error using JavaScript markdown
	const formattedError = highlighted(error);
	const embed = format.embed()
		.setColor('#ff8b8b')
		.setTitle(errorEmoji + ' Error')
		.setDescription(formattedError)
		.setTimestamp();

	// return the embed
	return embed;
};

const SUCCESS_EMBED = (message) => {
	const successEmoji = client.findEmoji('greenCheck');
	const embed = format.embed()
		.setColor('#8aff8b')
		.setTitle(successEmoji + ' Success')
		.setDescription(message)
		.setTimestamp();

	// Return the embed
	return embed;
};

const TRANSACTION_EMBED = (message) => {
	// const cautionEmoji = client.findEmoji('caution');
	const embed = format.embed()
		.setColor('#ffbb82')
		.setTitle('New Transaction !')
		.setDescription(message)
		.setFooter('Want more info? Check the pinned messages')
		.setTimestamp();

	// Return the embed
	return embed;
};

module.exports = {
	ERROR_EMBED,
	SUCCESS_EMBED,
	// Transaction embeds
	TRANSACTION_EMBED,
};