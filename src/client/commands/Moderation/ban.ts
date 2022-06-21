// External imports
import { SlashCommandBuilder, userMention } from '@discordjs/builders';
import {
  CommandInteraction,
  Permissions,
  GuildMember,
} from 'discord.js';

// Internal imports
import { DiscordClient, SlashCommand } from '../../structures';
import { EmbedEnum } from '../../../enums';
const { SUCCESS_EMBED, ERROR_EMBED, BAN_DM_EMBED } = EmbedEnum;

export default class BanCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Manually bans a member from the server.')
        .setDefaultMemberPermissions(null)
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('The member to ban')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('The reason for banning the member')
            .setRequired(true),
        ) as SlashCommandBuilder,
      category: 'Moderation',
      permissions: ['Moderator'],
    });
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const member = interaction.options.getMember('member') as GuildMember;
    const serverOwner = interaction.member as GuildMember;
    const reason = interaction.options.getString('reason') as string;

    try {
      // Handle if the member being banned is the server owner
      if (member.id === serverOwner.guild.ownerId) {
        return interaction.reply({
          embeds: [
            ERROR_EMBED(this.client, 'You cannot kick the server owner.'),
          ],
          ephemeral: true,
        });
      }

      // Handle if the member being banned is the interaction author
      if (member.id === interaction.user.id) {
        return interaction.reply({
          embeds: [ERROR_EMBED(this.client, 'You cannot kick yourself.')],
          ephemeral: true,
        });
      }

      // Handle if the member being banned is the bot
      if (member.id === this.client.user?.id) {
        return interaction.reply({
          embeds: [ERROR_EMBED(this.client, 'You cannot kick me!')],
          ephemeral: true,
        });
      }

      // Handle if the bot has the permission to ban the member
      if (
        !interaction.guild?.me?.permissions.has(Permissions.FLAGS.BAN_MEMBERS)
      ) {
        return interaction.reply({
          embeds: [
            ERROR_EMBED(
              this.client,
              'I do not have the permission to kick users.',
            ),
          ],
          ephemeral: true,
        });
      }

      // Handle if the interaction author has the permission to ban the member
      if (!interaction.memberPermissions?.has(Permissions.FLAGS.BAN_MEMBERS)) {
        return interaction.reply({
          embeds: [
            ERROR_EMBED(
              this.client,
              'You do not have the permission to kick users.',
            ),
          ],
          ephemeral: true,
        });
      }

      // Handle if the reason is too long
      if (reason.length < 1 || reason.length > 25) {
        return interaction.reply({
          embeds: [
            ERROR_EMBED(
              this.client,
              'The reason must be between 1 and 25 characters.',
            ),
          ],
          ephemeral: true,
        });
      }

      // Send the embed and ban the member
      await member
        .send({
          embeds: [BAN_DM_EMBED(interaction.guild, reason)],
        })
        .then(async () => await member.ban({ days: 7, reason: reason }))
        .catch((e) => '');

      // Send the success message
      return await interaction.reply({
        embeds: [
          SUCCESS_EMBED(
            this.client,
            `Successfully banned ${userMention(member.user.id)}`,
          ),
        ],
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
