/* eslint-disable no-unused-vars */
const {
	MessageCollector,
} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const format = require('../../utility/format');

// Import the format options
const {
	highlighted,
	codeBlock,
	bold,
} = format.formatOptions;

// Import the embed builders
const {
	ERROR_EMBED,
} = require('../../utility/embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rolemenu')
		.setDescription('Create a self-assignable role menu.')
		.setDefaultPermission(true),
	category: 'Configuration',
	permissions: ['Server Owner'],
	async execute(interaction) {
		const msgCollectorFilter = (msg) => msg.author.id === interaction.user.id;
		const options = [];

		try {
			// Define prompt messages to send to the user
			const promptMsg = [
				'Enter the roles you wish to add to the menu options',
				'Type \'.iamdone\' when you are finished. \'.stop\' to cancel.',
			].join('\n');

			// Send the prompt message
			await interaction.reply({
				content: codeBlock(promptMsg),
			});

			// Create a message collector to listen for responses
			const collector = new MessageCollector(
				interaction.channel,
				msgCollectorFilter.bind(null, interaction.message),
			);

			// Handle collecting the role menu options
			collector.on('collect', async (msg) => {
				// Chek if the user is a bot
				if (msg.author.bot) return;

				// When the keyword is triggerd, stop the collector, and save the data to the database.
				if (msg.content.toLowerCase() === '.iamdone') {
					collector.stop('Done command was issued. Collector stopped!');
					return;
				}

				// If the collector is manually stopped, cancel setup.
				if (msg.content.toLowerCase() === '.stop') {
					collector.stop(`${msg.author.tag} manual stop issued, canceling setup!`);
					return;
				}

				// If no role, return
				const roleName = msg.content;
				if (!roleName) return;

				// Checks if the role exists in the guild.
				const role = msg.guild.roles.cache.find(r =>
					r.name.toLowerCase() === roleName.toLowerCase());
				if (!role) {
					return interaction.channel.send({
						embeds: [ERROR_EMBED(`Role ${highlighted(roleName)} does not exist in this guild!`)],
					});
				}

				// Add the role to the options array
				options.push({ role: role });
			});


			// Handle when collector is stopped
			collector.on('end', async (collected, reason) => {
				// When the collector is stopped, save the data to the database.
				if (reason === 'Done command was issued. Collector stopped!') {
					// Add the options to the message row
					const roleMenu = format.rolemenu(options);
					const row = format.row()
						.addComponents(roleMenu);
					// await roleMenu.save(fetchedMessage.id, emojiRoleMappings, message);
					return interaction.channel.send({
						content: `${bold(interaction.guild.name)}'s Role Menu`,
						components: [row],
					});
				}
				return;
			});
		}
		catch (e) {
			return interaction.reply({
				embeds: [ERROR_EMBED(e.message)],
				ephemeral: true,
			});
		}
	},
};