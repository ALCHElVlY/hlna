// Exteranl imports
import { TextChannel } from 'discord.js';
import chalk from 'chalk';
import moment from 'moment';

// Internal imports
import { EmbedEnum } from '../../enums';
const {
  MEMBER_JOIN_EMBED,
  MEMBER_LEAVE_EMBED,
  MEMBER_BAN_ENBED,
  MEMBER_ROLE_ADD,
  MEMBER_ROLE_REMOVE,
  MESSAGE_BULK_DELETE_EMBED,
} = EmbedEnum;

export default class Logger {
  private actions: string[];
  private timestamp: string;

  constructor() {
    this.actions = [
      // Message related
      'MESSAGE_DELETE',
      'MESSAGE_UPDATE',
      // Role related
      'ROLE_ADD',
      'ROLE_REMOVE',
      // Member related
      'MEMBER_ADD',
      'MEMBER_REMOVE',
    ];
    this.timestamp = `[${moment().format('YYYY-MM-DD HH:mm:ss')}]:`;
  }

  /**
   * Logs the message to the console, formatted using `chalk` and `moment` for austhetics
   * as well as sending the message to the specified channel.
   * @param logType The type of log
   * @param content The content to log
   * @param channel The channel to send the log to
   */
  public async Log(
    content: any,
    logType?: string,
    channel?: TextChannel,
  ): Promise<void> {
    switch (logType) {
      case 'member_join':
        await channel?.send({ embeds: [MEMBER_JOIN_EMBED(content)] });
        break;
      case 'member_leave':
        await channel?.send({ embeds: [MEMBER_LEAVE_EMBED(content)] });
        break;
      case 'member_ban':
        await channel?.send({ embeds: [MEMBER_BAN_ENBED(content)] });
        break;
      case 'message_bulk_delete':
        await channel?.send({
          embeds: [
            MESSAGE_BULK_DELETE_EMBED([
              content[0].user,
              content[0].channelId,
              content[1],
            ]),
          ],
        });
        break;
      case 'role_add':
        await channel?.send({
          embeds: [MEMBER_ROLE_ADD(content[0], content[1])],
        });
        break;
      case 'role_remove':
        await channel?.send({
          embeds: [MEMBER_ROLE_REMOVE(content[0], content[1])],
        });
        break;
      default:
        console.log(`${this.timestamp} ${chalk.bgBlue('LOG')} ${content} `);
    }
  }
}
