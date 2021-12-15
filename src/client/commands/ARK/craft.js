/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
String.prototype.toProperCase = function(opt_lowerCaseTheRest) {
	return (opt_lowerCaseTheRest ? this.toLowerCase() : this)
		.replace(/(^|[\s\xA0])[^\s\xA0]/g, function(s) {
			return s.toUpperCase();
		});
};

// Import the various format options
const format = require('../../utility/format');
const {
	highlighted,
} = format.formatOptions;

// import the embed builders
const {
	CRAFT_EMBED,
	ERROR_EMBED,
} = require('../../utility/Embeds');

// Import the client & axios
const client = require('../../index');
const axios = require('axios');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('craft')
		.setDescription('Calculates the total resource cost of crafting x amount of items.')
		.addStringOption(option =>
			option.setName('item')
				.setDescription('The name of the item to craft.')
				.setRequired(true))
		.addNumberOption(option =>
			option.setName('quantity')
				.setDescription('The quantity of the item to craft.')
				.setRequired(true)),
	category: 'ARK',
	async execute(interaction) {
		const itemName = interaction.options._hoistedOptions[0].value.toProperCase()
			.replace(/[s]$/gm, '')
			.replace('Mdsm', 'M.D.S.M.')
			.replace('Mrlm', 'M.R.L.M.')
			.replace('Mdsm', 'M.S.C.M.')
			.replace('Momi', 'M.O.M.I.');
		const itemQty = interaction.options._hoistedOptions[1].value;

		// Send an API request to get the creature data
		const results = await axios.get(`${process.env.ITEMS}/${itemName}`, {
			headers: {
				'Authorization': 'Bearer ' + process.env.API_KEY,
			},
		});


		try {
			return interaction.reply({
				embeds: [CRAFT_EMBED(results.data, itemQty)],
				ephemeral: true,
			});
		}
		catch(e) {
			if (e instanceof TypeError) {
				return interaction.reply({
					embeds: [ERROR_EMBED([
						'Check the spelling of your search and try again.',
						`If this message appears again, no data exists in the database for \`${itemName}\`.`,
					].join(' '))],
					ephemeral: true,
				});
			}
		}
	},
};