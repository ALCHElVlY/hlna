/* eslint-disable no-unused-vars */
require('dotenv').config();
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
	ERROR_EMBED,
} = require('../../utility/Embeds');

// Import the client & axios
const client = require('../../index');
const axios = require('axios');

// Import the ARK official rates function
const _getOfficialRates = require('../../utility/functions/getOfficialRates');

// Import the clone embed
const {
	CLONE_EMBED,
} = require('../../utility/Embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clone')
		.setDescription('Calculates the time and cost of cloning a creature in ARK.')
		.addStringOption(option =>
			option.setName('creature_name')
				.setDescription('The name of the creature to clone.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('creature_level')
				.setDescription('The level of the creature being cloned.')
				.setRequired(true)),
	category: 'ARK',
	async execute(interaction) {
		const values = interaction.options._hoistedOptions;
		const OfficialRates = await _getOfficialRates();
		const mature_rate = await OfficialRates.get('BabyMatureSpeedMultiplier');

		// Loop through the values
		const userInputArray = [];
		for (const value of values) {
			const userInput = {};
			userInput.key = value.name;
			userInput.value = value.value;

			// push the user input into an array
			userInputArray.push(userInput);
		}

		// Search the database for the creature name
		const creatureName = userInputArray[0].value.toProperCase();
		const level = userInputArray[1].value;
		const results = await axios.get(`${process.env.DOSSIER}/${creatureName}`);


		try {
			// Handle if the creature is not found
			if (results.data === null) {
				throw new Error(`${highlighted(creatureName)} not found in the database.`);
			}
			const BaseElementCost = results.data.base_cost;
			const CostPerLevel = results.data.per_level_cost;
			const CostForLevel = (level * CostPerLevel);
			const clone_cost = (CostForLevel + BaseElementCost);
			const clone_time = (clone_cost * (7 / mature_rate));

			// Send the embed
			interaction.reply({
				embeds:[CLONE_EMBED(
					creatureName,
					level,
					clone_cost,
					clone_time,
					mature_rate,
				)],
				ephemeral: true,
			});
		}
		catch(e) {
			return interaction.reply({
				embeds: [ERROR_EMBED(e.message)],
				ephemeral: true,
			});
		}
	},
};