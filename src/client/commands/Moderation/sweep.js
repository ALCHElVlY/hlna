/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const format = require('../../utility/format');
const client = require('../../index');

// Import the logger class
const Logger = require('../../structures/Logger');

// Import the embed builders
const {
	ERROR_EMBED,
	SUCCESS_EMBED,
} = require('../../utility/Embeds');

// Import format options
const {
	channelMention,
} = format.formatOptions;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sweep')
		.setDescription('Bulk delete x amount of messages from a channel.')
		.setDefaultPermission(true)
		.addNumberOption(option =>
			option.setName('amount')
				.setDescription('The amount of messages to delete.')
				.setRequired(true))
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to delete messages from.')
				.setRequired(false)),
	category: 'Moderation',
	permissions: ['Moderator'],
	async execute(interaction) {
		const logger = new Logger();
		const settings = client.settings.get(interaction.guild.id);
		const { value } = interaction.options._hoistedOptions[0];
		const channel = (interaction.options._hoistedOptions[1])
			? interaction.options._hoistedOptions[1].channel
			: undefined;
		const amount = parseInt(value);

		try {
			// Handle if the amount is less than 1, or greater than 100
			if (amount <= 1 || amount > 100) {
				return interaction.reply({
					embeds: [ERROR_EMBED('Amount must be between 1 and 100.')],
					ephemeral: true,
				});
			}

			// Handle if a channel was provided in the options or not
			if (!channel) {
				// Delete the messages
				await interaction.channel.bulkDelete(amount, {
					filterOld: true,
				});

				// Send a success message
				await interaction.reply({
					embeds: [SUCCESS_EMBED(`${amount} messages have were deleted from this channel.`)],
					ephemeral: true,
				});

				// If there is no log channel set, do nothing
				if (settings.log_channels.length <= 0) return;

				// Find the log channel for MESSAGE_BULK_DELETE
				const channelID = settings.log_channels
					.find(c => c.log_type === 'message_bulk_delete').channel_id;
				const logChannel = client.channels.cache.get(channelID);

				// If the channel is not found, do nothing
				if (!logChannel) return;
				try {
					return logger.log(
						[interaction, amount],
						logChannel,
						'message_bulk_delete');
				}
				catch (e) {
					console.log(e);
				}
			}
			else {
				// Delete the messages
				await channel.bulkDelete(amount, {
					filterOld: true,
				});

				// Send a success message
				await interaction.reply({
					embeds: [SUCCESS_EMBED(`${amount} messages were deleted from ${channelMention(channel.id)}.`)],
					ephemeral: true,
				});

				// If there is no log channel set, do nothing
				if (settings.log_channels.length <= 0) return;

				// Find the log channel for MESSAGE_BULK_DELETE
				const channelID = settings.log_channels
					.find(c => c.log_type === 'message_bulk_delete').channel_id;
				const logChannel = client.channels.cache.get(channelID);

				// If the channel is not found, do nothing
				if (!logChannel) return;
				try {
					await logger.log(
						[interaction, amount],
						logChannel,
						'message_bulk_delete');
				}
				catch (e) {
					console.log(e);
				}
			}
		}
		catch (e) {
			const noLogChannelError = 'Cannot read properties of undefined (reading \'channel_id\')';
			if (e.message === noLogChannelError) return;
			return await interaction.reply({
				embeds: [ERROR_EMBED(e.message)],
				ephemeral: true,
			});
		}
	},
};