// External imports
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, Role } from 'discord.js';

// Internal imports
import { DiscordClient, SlashCommand } from '../../structures';
import { EmbedEnum } from '../../../enums';
const { ERROR_EMBED, REMOVE_ROLE_EMBED } = EmbedEnum;

export default class RemoveRoleCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('removerole')
        .setDescription('Manually removes a role from a member.')
        .setDefaultMemberPermissions(null)
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('The member to remove a role from')
            .setRequired(true),
        )
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('The role to remove from the member')
            .setRequired(true),
        ) as SlashCommandBuilder,
      category: 'Moderation',
      permissions: ['Moderator'],
    });
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const member = interaction.options.getMember('member') as GuildMember;
    const role = interaction.options.getRole('role') as Role;

    try {
      // Check if the member has the role
      if (!member.roles.cache.some((r) => r.name === role.name)) return;

      // Remove the role from the member.
      await member.roles.remove(role.id).then(async () => {
        await interaction.reply({
          embeds: [REMOVE_ROLE_EMBED(this.client, member, role)],
          ephemeral: true,
        });
      });
    } catch (e: any) {
      return interaction.reply({
        embeds: [ERROR_EMBED(this.client, e.message)],
        ephemeral: true,
      });
    }
  }
}
