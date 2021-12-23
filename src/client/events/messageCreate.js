const permissions = require('../structures/permissions');
const format = require('../utility/format');

module.exports = {
	name: 'messageCreate',
	once: false,
	run: async (client, message) => {

		// Ignore other bots
		if (message.author.bot) return;

		// Check for the prefix, either the default or the custom one
		const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(client.settings.get(message.guild.id)['prefix'])})\\s*`);
		if (!prefixRegex.test(message.content)) return;
		const [, matchedPrefix] = message.content.match(prefixRegex);

		// Split arguments
		const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
		const cmd = args.shift().toLowerCase();
		const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

		// If the member on a guild is invisible or not cached, fetch them.
		if (message.guild && !message.member) await message.guild.fetchMember(message.author);

		// Check whether the command, or alias, exist in the collections defined
		// in index.js.
		if (!command) return;

		// Some commands may not be useable in DMs. This check prevents those commands from running
		// and return a friendly error message.
		if (command && !message.guild && command.guildOnly) {
			return message.channel.send({
				content: 'This command is unavailable via private message. Please run this command in a server.',
			});
		}

		const context = {
			self: client,
			message: message,
			guild: message.guild,
			args: args,
		};

		// Get the users permission level
		const level = permissions.fromContext(context);
		const requiredLevel = permissions.fromName(command.permLevel);
		if (level < requiredLevel) {
			const embed = format.embed()
				.setColor('#ff8b8b')
				.setDescription(
					`${context.self.findEmoji('redCheckBox')} ` +
					'You do not have permission to use this command.' + '\n' +
					`Your permission level is ${level} (${permissions.list[level].name})` + '\n' +
					`This command requires level ${requiredLevel} (${command.permLevel})`,
				);

			return message.channel.send({ embeds: [embed] });
		}

		// If the command exists, and the user has permission, run it.
		console.log(`[CMD] ${permissions.list[level].name} ${message.author.username} (${message.author.id}) ran command: ${command.name}`);
		context.level = level;
		command.run(context);
	},
};