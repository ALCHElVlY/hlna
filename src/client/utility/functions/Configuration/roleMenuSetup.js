// Import Discord for JSDoc references
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');

// Import the message collector class from the discord.js library
const {
	MessageCollector,
} = require('discord.js');

// Import the format options
const format = require('../../format');
const {
	highlighted,
	codeBlock,
	bold,
} = format.formatOptions;

// Import the embed builders
const {
	ERROR_EMBED,
} = require('../../Embeds');


/**
 * The RoleMenuSetup function is used to create a self-assignable role menu
 * that gets sent to the channel specified, or the channel the command was
 * issued in.
 * @param {Discord.Channel} channel The channel to send the menu to
 * @param {Discord.Interaction} interaction The interaction callback
 */
async function RoleMenuSetup(channel, interaction) {
	const msgCollectorFilter = (msg) => msg.author.id === interaction.user.id;
	const options = [];


	// Define prompt messages to send to the user
	const promptMsg = [
		'Enter the roles you wish to add to the menu options',
		'Type \'.iamdone\' when you are finished. \'.stop\' to cancel.',
	].join('\n');

	// Send the prompt message in the channel the command was issued in
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

			// Send the role menu to the channel
			return channel.send({
				content: `${bold(interaction.guild.name)}'s Role Menu`,
				components: [row],
			});
		}
		return;
	});
}

module.exports = RoleMenuSetup;