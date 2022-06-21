// External imports
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, Role } from 'discord.js';

// Internal imports
import { DiscordClient, SlashCommand } from '../../structures';
import { EmbedEnum } from '../../../enums';
const { ERROR_EMBED, ADD_ROLE_EMBED } = EmbedEnum;

export default class AddRoleCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription('Manually adds a role to a member.')
        .setDefaultMemberPermissions(null)
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('The member to add the role to.')
            .setRequired(true),
        )
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('The role to add to the member.')
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
      // Check if the member has the role already
      if (member.roles.cache.some((r) => r.name === role.name)) return;
      await member.roles.add(role).then(async () => {
        await interaction.reply({
          embeds: [ADD_ROLE_EMBED(this.client, member, role)],
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
