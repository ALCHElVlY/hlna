const GuildSettings = require('../structures/GuildSettings');
const format = require('../utility/format');
const permissions = require('../structures/permissions');

module.exports = {
	name: 'interactionCreate',
	once: false,
	run: async (client, interaction) => {
		const guildsettings = new GuildSettings();
		// Handle if the interaction is a command
		if (interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return;


			// Get the users permission level
			const level = permissions.fromContext(interaction);
			const requiredLevel = permissions.fromName(command.permissions);
			if (level < requiredLevel) {
				const embed = format.embed()
					.setColor('#ff8b8b')
					.setDescription([
						`${client.findEmoji('redCheckBox')} You do not have permission to use this command.`,
						`Your permission level is ${level} (${permissions.list[level].name})`,
						`This command requires a permission level of ${requiredLevel} (${command.permissions})`,
					].join('\n'));

				return interaction.reply({
					embeds: [embed],
					ephemeral: true,
				});
			}

			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({
					content: 'There was an error while executing this command!',
					ephemeral: true,
				});
			}

		}

		// Handle if the interaction is a MessageButton
		if (interaction.isButton()) {
			const { customId } = interaction;
			const guild = await interaction.guild.fetch(interaction.guildId);
			const guildOwner = guild.ownerId;

			// Handle the button interactions
			switch (customId) {
			case 'settings:_edit':
				// If the user interacting is not the guild owner, ignore
				if (interaction.user.id !== guildOwner) return;

				// Clear the message components
				(async () => {
					await interaction.message.edit({
						embeds: [...interaction.message.embeds],
						components: [],
					});
				})();

				// Handle editing the guild settings
				await guildsettings.edit(interaction);
				break;
			case 'settings:_delete':
				// If the user interacting is not the guild owner, ignore
				if (interaction.user.id !== guildOwner) return;

				// Clear the message components
				(async () => {
					await interaction.message.edit({
						embeds: [...interaction.message.embeds],
						components: [],
					});
				})();

				// Handle deleting the guild settings
				// await guildsettings.delete(interaction);
				break;
			case 'settings:_restore':
				// If the user interacting is not the guild owner, ignore
				if (interaction.user.id !== guildOwner) return;

				// Clear the message components
				(async () => {
					await interaction.message.edit({
						embeds: [...interaction.message.embeds],
						components: [],
					});
				})();

				// Handle restoring the guild settings
				// await guildsettings.restore(interaction);
				break;
			}
		}

		// Handle if the interaction is a SelectMenu
	},
};