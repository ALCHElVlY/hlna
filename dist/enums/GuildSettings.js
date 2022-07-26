"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveLog = exports.AddLog = void 0;
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const structures_1 = require("../client/structures");
const enums_1 = require("../enums");
const functions_1 = tslib_1.__importDefault(require("../client/utils/functions"));
const env_config_1 = require("../interfaces/env_config");
const AddLog = async (client, interaction) => {
    const settings = client.settings.get(interaction.guild?.id)?.log_channels;
    const channelIDRegex = new RegExp(/(\d+)/gm);
    const { guild } = interaction;
    const logTypes = [
        '`MEMBER_JOINLEAVE`',
        '`MEMBER_BAN`',
        '`MEMBER_UNBAN`',
        '`MEMBER_KICK`',
        '`MEMBER_MUTE_ADD`',
        '`MEMBER_MUTE_REMOVE`',
        '`ROLE_ADD`',
        '`ROLE_REMOVE`',
        '`MESSAGE_DELETE`',
        '`MESSAGE_BULK_DELETE`',
        '`MESSAGE_UPDATE`',
    ];
    const response = await functions_1.default.AwaitReply(interaction, [
        'Enter a channel and the log type you would like to add',
        `Acceptable log types are: [${logTypes.join(', ')}]`,
    ].join('\n'));
    if (!response)
        return;
    const content = response.content.split(' ');
    const channelID = content[0].match(channelIDRegex)[0];
    const channel = client.channels.cache.get(channelID);
    const logChData = {
        key: 'log_channels_add',
        value: {
            channel_name: channel.name,
            channel_id: channelID,
            log_type: content[1],
        },
    };
    const formattedLogTypes = logTypes.join(',').replace(/(`)/gm, '').split(',');
    if (!formattedLogTypes.includes(content[1].toUpperCase())) {
        return await interaction.channel?.send({
            embeds: [
                enums_1.EmbedEnum.ERROR_EMBED(client, `${logChData.value.log_type} is not a valid log type!`),
            ],
        });
    }
    const channelExists = settings.find((ch) => ch.channel_id === channelID);
    const logTypeExists = settings.find((ch) => ch.log_type === content[1]);
    if (!channelExists && !logTypeExists) {
        await structures_1.AxiosPrivate.put(`${env_config_1.clientConfig.CONFIGURATION}/${guild?.id}`, {
            key: logChData.key,
            value: logChData.value,
        });
        await settings.push(logChData.value);
        return await interaction.channel?.send({
            embeds: [
                enums_1.EmbedEnum.SUCCESS_EMBED(client, `Added ${logChData.value.channel_name} to your log channel settings!`),
            ],
        });
    }
    else if (!channelExists && logTypeExists) {
        return interaction.channel?.send({
            embeds: [enums_1.EmbedEnum.ERROR_EMBED(client, 'Log type already exsits!')],
        });
    }
    else if (channelExists && !logTypeExists) {
        await structures_1.AxiosPrivate.put(`${env_config_1.clientConfig.CONFIGURATION}/${guild?.id}`, {
            key: logChData.key,
            value: logChData.value,
        });
        await settings.push(logChData.value);
        return await interaction.channel?.send({
            embeds: [
                enums_1.EmbedEnum.SUCCESS_EMBED(client, `Added ${logChData.value.channel_name} to your log channel settings!`),
            ],
        });
    }
    else {
        return interaction.channel?.send({
            embeds: [
                enums_1.EmbedEnum.ERROR_EMBED(client, 'Log type & channel already exsits!'),
            ],
        });
    }
};
exports.AddLog = AddLog;
const RemoveLog = async (client, interaction) => {
    const settings = client.settings.get(interaction.guild?.id).log_channels;
    const guild = interaction.guild;
    const logs = settings.map((log) => `${log.channel_name} - ${log.log_type}`);
    if (settings.length === 0) {
        return interaction.channel?.send({
            embeds: [
                enums_1.EmbedEnum.ERROR_EMBED(client, 'There are no log channels to remove!'),
            ],
        });
    }
    const response = await functions_1.default.AwaitReply(interaction, [
        'Enter a channel and the log type you would like to remove',
        `${(0, builders_1.codeBlock)(logs.join('\n'))}`,
    ].join('\n'));
    if (response) {
        const content = response.content.split(' - ');
        const channel = client.channels.cache.find((ch) => ch.name === content[0]);
        const logChData = {
            key: 'log_channels_remove',
            value: {
                channel_name: channel.name,
                channel_id: channel.id,
                log_type: content[1],
            },
        };
        try {
            await structures_1.AxiosPrivate.put(`${env_config_1.clientConfig.CONFIGURATION}/${guild?.id}`, {
                key: logChData.key,
                value: logChData.value,
            });
            await settings.splice(settings.indexOf(logChData.value), 1);
            return await interaction.channel?.send({
                embeds: [
                    enums_1.EmbedEnum.SUCCESS_EMBED(client, `Removed ${logChData.value.channel_name} from your log channel settings!`),
                ],
            });
        }
        catch (e) {
            console.log(e);
        }
    }
};
exports.RemoveLog = RemoveLog;
const GuildSettingsEnum = {
    Roles: async (client, interaction, response) => { },
    Logs: async (client, interaction, response) => {
        response = await functions_1.default.AwaitReply(interaction, 'Would you like to `add` or `remove` a log channel?');
        if (response) {
            const action = response.content;
            switch (action) {
                case 'add':
                    await (0, exports.AddLog)(client, interaction);
                    break;
                case 'remove':
                    await (0, exports.RemoveLog)(client, interaction);
                    break;
                default:
                    throw new Error('Invalid action!');
            }
        }
    },
};
exports.default = GuildSettingsEnum;
