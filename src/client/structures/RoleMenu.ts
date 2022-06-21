// External imports
import { codeBlock } from '@discordjs/builders';
import {
  Collection,
  CommandInteraction,
  Guild,
  GuildMember,
  Message,
  MessageCollector,
  Role,
  TextChannel,
} from 'discord.js';

// Internal imports
import DiscordClient from './DiscordClient';
import { EmbedEnum } from '../../enums';
import { row, rolemenu } from '../utils/format';
import ClientFunctions from '../utils/functions';
const { ERROR_EMBED, ROLE_MENU_EMBED } = EmbedEnum;

export default class RoleMenu {
  readonly client: DiscordClient;

  constructor(client: DiscordClient) {
    this.client = client;
  }

  /**
   * Adds an array of roles to a guild member.
   * @param member The member to add the role(s) to
   * @param roles The role(s) to add
   */
  public async AddRole(member: GuildMember, roles: Array<Role>): Promise<void> {
    if (roles.length <= 0) return;
    for (const role of roles) {
      if (!member.roles.cache.has(role.id)) {
        await member.roles.add(role);
      } else {
        await this.RemoveRole(member, role);
      }
    }
  }

  /**
   * Removes a role from a guild member.
   * @param member The member to remove the role from
   * @param role The role to remove
   */
  public async RemoveRole(member: GuildMember, role: Role): Promise<void> {
    if (!member.roles.cache.has(role.id)) return;
    await member.roles.remove(role);
  }

  /**
   * Sends a series of rolemenu setup messages to the user and sends the rolemenu
   * to the provided channel (**defaults to the interaction channel**).
   * @param interaction The command interaction
   * @param channel The channel to send the rolemenu to
   */
  public async Setup(
    interaction: CommandInteraction,
    channel: TextChannel,
  ): Promise<void> {
    const msgCollectorFilter = (msg: Message) =>
      msg.author.id === interaction.user.id;
    const guild = interaction?.guild as Guild;
    const options: Array<any> = [];

    // Define prompt messages to send to the user
    const promptMsg: string = [
      'Enter the roles you wish to add to the menu options',
      "Type '.iamdone' when you are finished. '.stop' to cancel.",
    ].join('\n');

    // Send the prompt message in the channel the command was issued in
    await interaction.reply({
      content: codeBlock(promptMsg),
    });

    // Create a message collector to listen for responses
    const collector = new MessageCollector(interaction.channel as TextChannel, {
      filter: msgCollectorFilter,
      time: 10 * 60 * 1000,
    });

    // Handle collecting the role menu options
    collector.on('collect', async (msg: Message): Promise<any> => {
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
      const role = msg.guild?.roles.cache.find(
        (r) => r.name.toLowerCase() === roleName.toLowerCase(),
      );
      if (!role) {
        return channel.send({
          embeds: [
            ERROR_EMBED(
              this.client,
              `Role ${ClientFunctions.HighLight(roleName)} does not exist in this guild!`,
            ),
          ],
        });
      }

      // Add the role to the options array
      options.push({ role: role });
    });

    // Handle when collector is stopped
    collector.on('end', async (collected, reason): Promise<any> => {
      // Handle if the collector was manually stopped
      if (reason === 'Done command was issued. Collector stopped!') {
        // Add the options to the message row
        const roleMenu = rolemenu(options);
        const componentRow = row().addComponents(roleMenu);

        // Clear the setup messages
        await this.ClearSetup(this.client, collected);

        // Send the role menu to the channel
        return await channel.send({
          embeds: [ROLE_MENU_EMBED(guild)],
          components: [componentRow],
        });
      }
      return;
    });
  }

  /**
   * Clears the rolemenu setup messages.
   * @param client The Discord client
   * @param messages Collection of messages to clear
   */
  private async ClearSetup(
    client: DiscordClient,
    messages: Collection<string, Message<boolean>>,
  ): Promise<void> {
    const channelID: Array<any> = [];

    // Loop through the collected messages and get the channel ID
    messages.forEach((message) => {
      if (channelID.includes(message.channelId)) return;
      channelID.push(message.channelId);
    });

    // Get the channel from the client cache, and delete the messages
    const channel = client.channels.cache.get(channelID[0]) as TextChannel;
    channel.messages.cache.forEach(async (msg) => {
      await msg.delete();
    });
  }
}
