// External imports
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Permissions, GuildMember, Role } from 'discord.js';

// Internal imports
import { DiscordClient, SlashCommand } from '../../structures';
import { EmbedEnum } from '../../../enums';
import ClientFunctions from '../../utils/functions';
const { ERROR_EMBED, ADD_MUTE_EMBED } = EmbedEnum;

export default class MuteCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Bans a member from the server.')
        .setDefaultMemberPermissions(null)
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('The member to mute.')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('time')
            .setDescription(
              'The time to mute the member for. (ex: 1m, 1h, 1d, 1w)',
            )
            .setRequired(false),
        ) as SlashCommandBuilder,
      category: 'Moderation',
      permissions: ['Moderator'],
    });
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const settings = this.client.settings.get(interaction.guild?.id);
    const muteRole = interaction.guild?.roles.cache.get(
      settings['roles'].mute_role,
    ) as Role;
    const memberToMute = interaction.options.getMember('member') as GuildMember;
    const member = interaction.member as GuildMember;
    const time = interaction.options.getString('time') as string;
    const muteDuration = time
      ? ClientFunctions.FormatMuteTime(time)
      : undefined;
    const muteTime = 31536000000 * 100;

    try {
      // Check if the member using the command has the required permissions
      if (!member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
        throw Error(
          'You do not have the required permissions to mute members.',
        );
      }

      // Handle if the member being muted is a moderator
      // bypasses if the author is an administrator
      if (
        memberToMute.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS) &&
        !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
      ) {
        throw new Error('You cannot mute an administrator.');
      }

      // Handle if the member being muted is the bot(HLN-A)
      if (member.id === interaction.client.user?.id) {
        throw new Error('You cannot mute me!');
      }

      // Handle if the member being muted is the interaction author
      if (member.id === interaction.user.id) {
        throw new Error('You cannot mute yourself!');
      }

      switch (muteRole) {
        default:
          switch (time) {
            case 'null':
              await member.roles.add(muteRole);
              await member.timeout(muteTime, 'This is a test manual unmute');
              await interaction.reply({
                embeds: [ADD_MUTE_EMBED(this.client, member)],
                ephemeral: true,
              });
              break;
            default:
              await member.roles.add(muteRole);
              await member.timeout(muteTime, 'This is a test timed mute');
              await interaction.reply({
                embeds: [ADD_MUTE_EMBED(this.client, member, time)],
                ephemeral: true,
              });
              setTimeout(() => {
                member.roles.remove(muteRole);
              }, muteDuration);
              break;
          }
      }
    } catch (e: any) {
      interaction.reply({
        embeds: [ERROR_EMBED(this.client, e.message)],
        ephemeral: true,
      });
    }
  }
}
