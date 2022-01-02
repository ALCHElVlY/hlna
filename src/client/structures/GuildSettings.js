/* eslint-disable no-unused-vars */
// Import Discord for JDoc references
const Discord = require('discord.js');
const client = require('../index');
const axios = require('axios');

// Import the embed builders
const {
	SUCCESS_EMBED,
	ERROR_EMBED,
} = require ('../utility/embeds');

// Import the worker functions
const {
	configWorker_roles,
	configWorker_logs,
} = require('../utility/functions/Configuration/index');

class GuildSettings {
	// eslint-disable-next-line no-empty-function
	constructor() {}


	/**
     * The edit method accepts a Discord interaction as an
     * argument and handles the editing of the guild settings.
     * @param {Discord.Interaction} interaction
     */
	async edit(interaction) {
		// Prompt the user for the setting they want to edit
		interaction.reply({
			content: 'Which setting would you like to edit?',
		});

		// Create a filter for the message collector
		const filter = m => {
			// If the message author is the interaction author, return true
			if (m.author.id === interaction.user.id) return true;
			// Else return false
			return false;
		};

		try {
			// Handle the user response
			const response = await interaction.channel.awaitMessages({
				filter,
				max: 1,
				time: 30000,
				errors: ['time'],
			});
			if (response) {
				const { content } = response.first();
				switch (content) {
				case 'roles':
					await configWorker_roles(client, interaction, response);
					break;
				case 'log channels':
					await configWorker_logs(client, interaction, response);
					break;
				default:
					throw Error('That setting either does not exist or is not editable.');
				}
			}
		}
		catch (e) {
			interaction.channel.send({
				embeds: [ERROR_EMBED(e.message)],
				ephemeral: true,
			});
		}
	}


	async restore(interaction) {
		const { guild } = interaction;
		// Define a default guild setting object
		const defaultSettings = {
			features: {
				shop_management: false,
				member_welcome: false,
				anti_raid: false,
				invite_tracking: false,
			},
			roles: {
				admin_role: null,
				dev_role: null,
				mod_role: null,
				verified_role: null,
				mute_role: null,
			},
			ark_shop: {
				order_channel: {
					name: null,
					id: null,
				},
				order_key: {
					emoji: null,
					description: null,
				},
				shop_status: 'closed',
				accepted_payments: [],
				items: [],
			},
			log_channels: [],
		};

		// Prompt the user to confirm restoring the guild settings
		const response = await client.awaitConfirmation(
			interaction,
			'Are you sure you want to restore the guild settings to their default values?',
		);

		if (response) {
			// Send an API request to update the database
			await axios.put(`${process.env.CONFIGURATION}/${guild.id}`, {
				key: 'restore_settings',
				value: defaultSettings,
			}, { headers: { 'Authorization': 'Bearer ' + process.env.API_KEY } });

			// Update the guild settings
			client.settings.set(guild.id, defaultSettings);

			// Send a confirmation message
			interaction.channel.send({
				embeds: [SUCCESS_EMBED('Guild settings have been restored to their default values.')],
			});
		}
	}
}
module.exports = GuildSettings;