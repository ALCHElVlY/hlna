/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const format = require('../../utility/format');

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
		const { value } = interaction.options._hoistedOptions[0];
		const { channel } = interaction.options._hoistedOptions[1] || undefined;
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
				return interaction.reply({
					embeds: [SUCCESS_EMBED(`${amount} messages have were deleted from this channel.`)],
					ephemeral: true,
				});
			}
			else {
				// Delete the messages
				await channel.bulkDelete(amount, {
					filterOld: true,
				});

				// Send a success message
				return interaction.reply({
					embeds: [SUCCESS_EMBED(`${amount} messages have were deleted from ${channelMention(channel.id)}.`)],
					ephemeral: true,
				});
			}
		}
		catch (e) {
			return interaction.reply({
				embeds: [ERROR_EMBED(e.message)],
				ephemeral: true,
			});
		}
	},
};