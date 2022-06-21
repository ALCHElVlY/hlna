// External imports
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  CommandInteraction,
  Permissions,
  GuildMember,
} from 'discord.js';

// Internal imports
import { DiscordClient, SlashCommand } from '../../structures';
import { EmbedEnum } from '../../../enums';
const { SUCCESS_EMBED, ERROR_EMBED, KICK_DM_EMBED } = EmbedEnum;

export default class KickCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Manually kicks a member from the server.')
        .setDefaultMemberPermissions(null)
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('The member to kick')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('The reason for kicking the member')
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
      // Handle if the member being kicked is the server owner
      if (member.id === serverOwner.guild.ownerId) {
        return interaction.reply({
          embeds: [
            ERROR_EMBED(this.client, 'You cannot kick the server owner.'),
          ],
          ephemeral: true,
        });
      }

      // Handle if the member being kicked is the interaction author
      if (member.id === interaction.user.id) {
        return interaction.reply({
          embeds: [ERROR_EMBED(this.client, 'You cannot kick yourself.')],
          ephemeral: true,
        });
      }

      // Handle if the member being kicked is the bot
      if (member.id === this.client.user?.id) {
        return interaction.reply({
          embeds: [ERROR_EMBED(this.client, 'You cannot kick me!')],
          ephemeral: true,
        });
      }

      // Handle if the bot has the permission to kick the member
      if (
        !interaction.guild?.me?.permissions.has(Permissions.FLAGS.KICK_MEMBERS)
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

      // Handle if the interaction author has the permission to kick the member
      if (!interaction.memberPermissions?.has(Permissions.FLAGS.KICK_MEMBERS)) {
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

      // Send the embed and kick the member
      await member
        .send({
          embeds: [KICK_DM_EMBED(interaction.guild, reason)],
        })
        .then(async () => await member.kick(reason))
        .catch((e) => '');

      // Send a success message
      return await interaction.reply({
        embeds: [
          SUCCESS_EMBED(this.client, `Successfully kicked ${member.user.tag}`),
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
