/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const format = require('../../utility/format');
const client = require('../../index');

// Import parsing utilities
const {
	hyperlink,
	highlighted,
	codeBlock,
	roleMention,
} = format.formatOptions;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('View, edit, or restore HLN-A\'s settings for this Discord.'),
	category: 'Configuration',
	permissions: ['Server Owner'],
	async execute(interaction) {
		// Import the client settings for the guild
		const settings = client.settings.get(interaction.guild.id);
		const GitHubRepo = hyperlink('GitHub Repo', process.env.GITHUB_REPO);
		const devDiscord = hyperlink('Dev Discord', process.env.DEV_DISCORD);

		// Build default embed elements
		const embed = format.embed()
			.setTitle('Configuration')
			.setDescription([
				`Welcome ${interaction.user} to your guild settings!`,
				`${GitHubRepo} • ${devDiscord}`,
			].join('\n'));

		// Set the features display
		embed.addField('Features', (() => {
			let general_settings = '';
			Object.entries(settings.features)
				.forEach(([key, value]) => {
					// Check if the role settings are empty
					if (value !== false) {
						general_settings += format.prettyPrint(`${key}: ${client.findEmoji('greenCheckBox')} ${highlighted('enabled')},`);
					}
					else {
						// If the role settings have not be set, display null
						general_settings += format.prettyPrint(`${key}: ${client.findEmoji('redCheckBox')} ${highlighted('disabled')},`);
					}
				});
			return general_settings.split(',').join('\n');
		})(), true);

		// Add a blank space between the feature settings and roles
		embed.addField('\u200b', '\u200b', true);

		// Set the role settings display
		embed.addField('Roles', (() => {
			let role_settings = '';
			Object.entries(settings.roles)
				.filter(([key]) => key.includes('role'))
				.forEach(([key, value]) => {
					// Check if the role settings are empty
					if (key.includes('role') && value !== null) {
						role_settings += format.prettyPrint(`${key}: ${roleMention(value)},`);
					}
					else {
						// If the role settings have not be set, display null
						role_settings += format.prettyPrint(`${key}: ${highlighted(value)},`);
					}
				});
			return role_settings.split(',').join('\n');
		})(), true);

		// Add a blank space between the role settings and log channels
		// embed.addField('\u200b', '\u200b', false);

		// Set the log channel settings display
		embed.addField('Log Channels', (() => {
			let log_channels = '';
			if (settings.log_channels.length > 0) {
				settings.log_channels.forEach((channel) => {
					log_channels += format.prettyPrint(
						`<#${channel.channel_id}>: ${channel.channel_id} • ${channel.action_type.toUpperCase()},`,
					);
				});
			}
			else {
				log_channels += highlighted('None');
			}
			return log_channels.split(',').join('\n');
		})(), false);

		// Build the embed message components
		const row = format.row()
			.addComponents(
				// The edit button
				format.button()
					.setCustomId('settings:_edit')
					.setLabel('Edit')
					.setStyle('SECONDARY')
					.setEmoji(':edit:911734573036109895'),
				// The delete button
				format.button()
					.setCustomId('settings:_delete')
					.setLabel('Delete')
					.setStyle('SECONDARY')
					.setEmoji(':delete:911736328553648199'),
				// The restore button
				format.button()
					.setCustomId('settings:_restore')
					.setLabel('Restore')
					.setStyle('SECONDARY')
					.setEmoji(':restore:911737337510252574'),
			);

		try {
			// Send the ineraction response
			await interaction.reply({
				embeds: [embed],
				components: [row],
			}).then(() => {
				// Create a button interaction collector
				// remove the components from the message after 3 minutes
				// if the user does not respond
				const channel = interaction.channel;
				const collector = channel.createMessageComponentCollector({
					componentType: 'BUTTON',
					// filter,
					time: 180000,
				});

				// Handle the collector
				collector.on('end', async () => {
					// If the collector has ended, remove the message components
					await interaction.editReply({
						embeds: [embed],
						components: [],
					});
				});
			});
		}
		catch (e) {
			await interaction.reply({
				content: [
					client.findEmoji('error'),
					'An error occurred while trying to send the settings.',
					`${codeBlock('js', e.message)}`,
				].join(' '),
				ephemeral: true,
			});
		}
	},
};