// External imports
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  CommandInteraction,
  GuildMember,
  Guild,
  Role,
} from 'discord.js';

// Internal imports
import { DiscordClient, SlashCommand } from '../../structures';
import { EmbedEnum } from '../../../enums';
const { ERROR_EMBED, REMOVE_MUTE_EMBED } = EmbedEnum;

export default class UnmuteCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Manually unmutes a member.')
        .setDefaultMemberPermissions(null)
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('The member to unmute.')
            .setRequired(true),
        ) as SlashCommandBuilder,
      category: 'Moderation',
      permissions: ['Moderator'],
    });
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const guild = interaction.guild as Guild;
    const settings = this.client.settings.get(guild.id);
    const muteRole = guild.roles.cache.get(settings['roles'].mute_role) as Role;
    const member = interaction.options.getMember('member') as GuildMember;

    try {
      // Check if the member is muted
      if (!member.roles.cache.has(muteRole.id)) {
        throw new Error('The member is not muted.');
      }

      // Remove the mute role
      await member.roles.remove(muteRole);
      await member.timeout(null);

      // Send the success embed
      await interaction.reply({
        embeds: [REMOVE_MUTE_EMBED(this.client, member)],
        ephemeral: true,
      });
    } catch (e: any) {
      return interaction.reply({
        embeds: [ERROR_EMBED(this.client, e.message)],
        ephemeral: true,
      });
    }
  }
}
