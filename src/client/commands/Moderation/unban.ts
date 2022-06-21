// External imports
import { SlashCommandBuilder, userMention } from '@discordjs/builders';
import { CommandInteraction, GuildMember, Guild } from 'discord.js';

// Internal imports
import { DiscordClient, SlashCommand } from '../../structures';
import { EmbedEnum } from '../../../enums';
const { SUCCESS_EMBED, ERROR_EMBED, BAN_LIST_EMBED } = EmbedEnum;

export default class UnbanCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Manually unban a member from the server, or list all bans.')
        .setDefaultMemberPermissions(null)
        .addSubcommand((subcommand) =>
          subcommand
            .setName('member')
            .setDescription('The member to unban')
            .addUserOption((option) =>
              option
                .setName('target')
                .setDescription('The member')
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('list')
            .setDescription('List all bans in the server.'),
        ) as SlashCommandBuilder,
      category: 'Moderation',
      permissions: ['Moderator'],
    });
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const subcommand = interaction.options.getSubcommand();
    const member = interaction.member as GuildMember;
    const memberToUnban =
      (interaction.options.getMember('member') as GuildMember) ?? null;
    const guild = member.guild as Guild;
    // const reason = interaction.options.getString('reason);
    const guildBans: Array<any> = [];

    try {
      // Determine the subcommand
      switch (subcommand) {
        case 'member':
          guild.members.unban(member).then(async () => {
            await interaction.reply({
              embeds: [
                SUCCESS_EMBED(
                  this.client,
                  `${userMention(memberToUnban.id)} has been unbanned.`,
                ),
              ],
              ephemeral: true,
            });
          });
          break;
        case 'list':
          guild.bans.fetch().then(async (bans) => {
            // Handle if the guild has no bans
            if (bans.size <= 0) {
              return interaction.reply({
                embeds: [
                  ERROR_EMBED(
                    this.client,
                    'there are currently no bans for this server!',
                  ),
                ],
                ephemeral: true,
              });
            }

            bans.forEach((ban) => {
              const data = {
                user: {
                  name: ban.user.username,
                  id: ban.user.id,
                },
                reason: ban.reason,
              };
              guildBans.push(data);
            });

            // Send the embed
            await interaction.reply({
              embeds: [BAN_LIST_EMBED(guild, guildBans)],
              ephemeral: true,
            });
          });
          break;
      }
    } catch (e: any) {
      return interaction.reply({
        embeds: [ERROR_EMBED(this.client, e.message)],
        ephemeral: true,
      });
    }
  }
}
