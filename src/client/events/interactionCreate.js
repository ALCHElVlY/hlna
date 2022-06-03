// Internal imports
const GuildSettings = require('../structures/GuildSettings');
const format = require('../utility/format');
const permissions = require('../structures/permissions');
const RoleMenu = require('../structures/RoleMenu');

module.exports = {
  name: 'interactionCreate',
  once: false,
  run: async (client, interaction) => {
    const guildsettings = new GuildSettings();
    const rolemenu = new RoleMenu();

    // Handle if the interaction is a command
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      // Get the users permission level
      const level = permissions.fromContext(interaction);
      const requiredLevel = permissions.fromName(command.permissions);
      // Check if the user has the required permissions to run the command
      if (level < requiredLevel) {
        const embed = format
          .embed()
          .setColor('#ff8b8b')
          .setDescription(
            [
              `${client.findEmoji(
                'redCheckBox',
              )} You do not have permission to use this command.`,
              `Your permission level is ${level} (${permissions.list[level].name})`,
              `This command requires a permission level of ${requiredLevel} (${command.permissions})`,
            ].join('\n'),
          );

        return interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }

      try {
        await command.execute(interaction);
      } catch (error) {
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
            try {
              await interaction.message.edit({
                embeds: [...interaction.message.embeds],
                components: [],
              });
            } catch (e) {
              console.log(e);
            }
          })();

          // Handle editing the guild settings
          await guildsettings.edit(interaction);
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
          await guildsettings.restore(interaction);
          break;
      }
    }

    // Handle if the interaction is a SelectMenu
    if (interaction.isSelectMenu()) {
      const { customId, values, member } = interaction;
      const guild = await interaction.guild.fetch(interaction.guildId);
      const roles = [];
      const currentSelection = values.filter((option) => {
        return !values.includes(option.value);
      });

      // Loop through the selected menu values and push them to the roles array
      for (const role of currentSelection) {
        const guildRole = guild.roles.cache.find((r) => r.name === role);
        roles.push(guildRole);
      }

      switch (customId) {
        case 'role-menu':
          // Handle the role menu
          await rolemenu.addRoles(member, roles);
          await interaction
            .update({
              components: [...interaction.message.components],
            })
            .then(async () => {
              await interaction.followUp({
                content: 'Your roles have been updated!',
                ephemeral: true,
              });
            });
          break;
      }
    }
  },
};
