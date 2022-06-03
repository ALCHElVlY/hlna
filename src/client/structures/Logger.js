// Exteranl imports
const chalk = require('chalk');
const moment = require('moment');

// Internal imports
const {
  MEMBER_JOIN_EMBED,
  MEMBER_LEAVE_EMBED,
  MEMBER_BAN_ENBED,
  MEMBER_ROLE_ADD,
  MEMBER_ROLE_REMOVE,
  MESSAGE_BULK_DELETE_EMBED,
} = require('../utility/Embeds');

class Logger {
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
   * @param {*} content - The content to log
   * @param {*} channel - The channel to send the log to
   * @param {*} logType - The type of log
   */
  async log(content = [], channel, logType) {
    switch (logType) {
      case 'member_join':
        await channel.send({ embeds: [MEMBER_JOIN_EMBED(content)] });
        break;
      case 'member_leave':
        await channel.send({ embeds: [MEMBER_LEAVE_EMBED(content)] });
        break;
      case 'member_ban':
        await channel.send({ embeds: [MEMBER_BAN_ENBED(content)] });
        break;
      case 'message_bulk_delete':
        await channel.send({
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
        await channel.send({
          embeds: [MEMBER_ROLE_ADD(content[0], content[1])],
        });
        break;
      case 'role_remove':
        await channel.send({
          embeds: [MEMBER_ROLE_REMOVE(content[0], content[1])],
        });
        break;
      default:
        console.log(`${this.timestamp} ${chalk.bgBlue('LOG')} ${content} `);
    }
  }
}

module.exports = Logger;