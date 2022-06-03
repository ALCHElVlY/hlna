// eslint-disable-next-line no-unused-vars
// Built-in imports
const Discord = require('discord.js'); // JSDoc reference only
const { MessageCollector } = require('discord.js');

// Internal imports
const client = require('../index');
const { ROLE_MENU_EMBED, ERROR_EMBED } = require('../utility/Embeds');
const format = require('../utility/format');
const { highlighted, codeBlock } = format.formatOptions;

class RoleMenu {
  // eslint-disable-next-line no-empty-function
  constructor() {}

  /**
   * The addRole method adds a role to the member
   * when they select it from the menu.
   * @param {Discord.GuildMember} member The member to add the role to
   * @param {Discord.Role} roles The roles to add to the member
   * @returns {Promise<void>}
   */
  async addRoles(member, roles = []) {
    if (roles.length <= 0) return;
    // Loop through the roles and add them to the member
    // if they don't already have the roles
    for (const role of roles) {
      if (!member.roles.cache.has(role.id)) {
        await member.roles.add(role);
      } else {
        await this.removeRole(member, role);
      }
    }
  }

  /**
   * The removeRole method removes a role from the member
   * when they select it from the menu.
   * @param {Discord.GuildMember} member The member to remove the role from
   * @param {Discord.Role} role The role to remove from the member
   * @returns {Promise<void>}
   */
  async removeRole(member, role) {
    // If the member doesn't have the role, return
    if (!member.roles.cache.has(role.id)) return;
    // Remove the role from the member
    await member.roles.remove(role);
  }

  /**
   * The setup method is used to create a self-assignable role menu
   * that gets sent to the channel specified, or the channel the command was
   * issued in.
   * @param {Discord.Channel} channel The channel to send the menu to
   * @param {Discord.Interaction} interaction The interaction callback
   * @returns {Promise<*>}
   */
  async setup(channel, interaction) {
    const msgCollectorFilter = (msg) => msg.author.id === interaction.user.id;
    const options = [];

    // Define prompt messages to send to the user
    const promptMsg = [
      'Enter the roles you wish to add to the menu options',
      "Type '.iamdone' when you are finished. '.stop' to cancel.",
    ].join('\n');

    // Send the prompt message in the channel the command was issued in
    await interaction.reply({
      content: codeBlock(promptMsg),
    });

    // Create a message collector to listen for responses
    const collector = new MessageCollector(interaction.channel, {
      filter: msgCollectorFilter,
      time: 10 * 60 * 1000,
    });

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
        collector.stop(
          `${msg.author.tag} manual stop issued, canceling setup!`,
        );
        return;
      }

      // If no role, return
      const roleName = msg.content;
      if (!roleName) return;

      // Checks if the role exists in the guild.
      const role = msg.guild.roles.cache.find(
        (r) => r.name.toLowerCase() === roleName.toLowerCase(),
      );
      if (!role) {
        return interaction.channel.send({
          embeds: [
            ERROR_EMBED(
              `Role ${highlighted(roleName)} does not exist in this guild!`,
            ),
          ],
        });
      }

      // Add the role to the options array
      options.push({ role: role });
    });

    // Handle when collector is stopped
    collector.on('end', async (collected, reason) => {
      // Handle if the collector was manually stopped
      if (reason === 'Done command was issued. Collector stopped!') {
        // Add the options to the message row
        const roleMenu = format.rolemenu(options);
        const row = format.row().addComponents(roleMenu);

        // Clear the setup messages
        await this.clearSetup(collected);

        // Send the role menu to the channel
        return await channel.send({
          embeds: [ROLE_MENU_EMBED(interaction.guild)],
          components: [row],
        });
      }
      return;
    });
  }

  /**
   * The clearSetup method is used to clear the setup process
   * after the role menu has been sent to the channel.
   * @param {*} messages A collection of messages to delete
   */
  async clearSetup(messages) {
    const channelID = [];

    // Loop through the collected messages and get the channel ID
    messages.forEach((message) => {
      if (channelID.includes(message.channelId)) return;
      channelID.push(message.channelId);
    });

    // Get the channel from the client cache, and delete the messages
    const channel = client.channels.cache.get(channelID[0]);
    channel.messages.cache.forEach(async (msg) => {
      await msg.delete();
    });
  }
}
module.exports = RoleMenu;
