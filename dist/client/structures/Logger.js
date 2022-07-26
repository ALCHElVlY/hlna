"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const enums_1 = require("../../enums");
const { MEMBER_JOIN_EMBED, MEMBER_LEAVE_EMBED, MEMBER_BAN_ENBED, MEMBER_ROLE_ADD, MEMBER_ROLE_REMOVE, MESSAGE_BULK_DELETE_EMBED, } = enums_1.EmbedEnum;
class Logger {
    actions;
    timestamp;
    constructor() {
        this.actions = [
            'MESSAGE_DELETE',
            'MESSAGE_UPDATE',
            'ROLE_ADD',
            'ROLE_REMOVE',
            'MEMBER_ADD',
            'MEMBER_REMOVE',
        ];
        this.timestamp = `[${(0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss')}]:`;
    }
    async Log(content, logType, channel) {
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
                console.log(`${this.timestamp} ${chalk_1.default.bgBlue('LOG')} ${content} `);
        }
    }
}
exports.default = Logger;
