"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const structures_1 = require("../../structures");
const functions_1 = tslib_1.__importDefault(require("../../utils/functions"));
const env_config_1 = require("../../../interfaces/env_config");
const format_1 = require("../../../client/utils/format");
class SettingsCommand extends structures_1.SlashCommand {
    constructor(client) {
        super(client, {
            data: new builders_1.SlashCommandBuilder()
                .setName('settings')
                .setDescription("View, edit, or restore HLN-A's settings for this Discord.")
                .setDefaultMemberPermissions(null),
            category: 'Configuration',
            permissions: ['Server Owner'],
        });
    }
    async execute(interaction) {
        const settings = this.client.settings.get(interaction.guild?.id);
        const GitHubRepo = (0, builders_1.hyperlink)('GitHub Repo', env_config_1.clientConfig.GITHUB_REPO);
        const devDiscord = (0, builders_1.hyperlink)('Dev Discord', env_config_1.clientConfig.DEV_DISCORD);
        const response = (0, format_1.embed)()
            .setTitle('Configuration')
            .setDescription([
            `Welcome ${interaction.user} to your guild settings!`,
            `${GitHubRepo} • ${devDiscord}`,
        ].join('\n'));
        response.addField('Features', (() => {
            let general_settings = '';
            Object.entries(settings.features).forEach(([key, value]) => {
                if (value !== false) {
                    general_settings += (0, format_1.prettyPrint)(`${key}: ${functions_1.default.FindEmoji(this.client, 'greenCheckBox')} ${functions_1.default.HighLight('enabled')},`);
                }
                else {
                    general_settings += (0, format_1.prettyPrint)(`${key}: ${functions_1.default.FindEmoji(this.client, 'redCheckBox')} ${functions_1.default.HighLight('disabled')},`);
                }
            });
            return general_settings.split(',').join('\n');
        })(), true);
        response.addField('\u200b', '\u200b', true);
        response.addField('Roles', (() => {
            let role_settings = '';
            Object.entries(settings.roles)
                .filter(([key]) => key.includes('role'))
                .forEach(([key, value]) => {
                if (key.includes('role') && value !== null) {
                    role_settings += (0, format_1.prettyPrint)(`${key}: ${(0, builders_1.roleMention)(value)},`);
                }
                else {
                    role_settings += (0, format_1.prettyPrint)(`${key}: ${functions_1.default.HighLight(value)},`);
                }
            });
            return role_settings.split(',').join('\n');
        })(), true);
        response.addField('Log Channels', (() => {
            let log_channels = '';
            if (settings.log_channels.length > 0) {
                settings.log_channels.forEach((channel) => {
                    log_channels += (0, format_1.prettyPrint)(`<#${channel.channel_id}>: ${channel.channel_id} • ${channel.log_type.toUpperCase()},`);
                });
            }
            else {
                log_channels += functions_1.default.HighLight('None');
            }
            return log_channels.split(',').join('\n');
        })(), false);
        const responseRow = (0, format_1.row)().addComponents((0, format_1.button)()
            .setCustomId('settings:_edit')
            .setLabel('Edit')
            .setStyle('SECONDARY')
            .setEmoji(':edit:911734573036109895'), (0, format_1.button)()
            .setCustomId('settings:_restore')
            .setLabel('Restore')
            .setStyle('SECONDARY')
            .setEmoji(':restore:911737337510252574'));
        try {
            await interaction
                .reply({
                embeds: [response],
                components: [responseRow],
            })
                .then(() => {
                const channel = interaction.channel;
                const collector = channel.createMessageComponentCollector({
                    componentType: 'BUTTON',
                    time: 180000,
                });
                collector.on('end', async () => {
                    try {
                        await interaction.editReply({
                            embeds: [response],
                            components: [],
                        });
                    }
                    catch (e) {
                        if (e.message === 'Unknown Message')
                            return;
                        console.log(e);
                    }
                });
            });
        }
        catch (e) {
            await interaction.reply({
                content: [
                    functions_1.default.FindEmoji(this.client, 'error'),
                    'An error occurred while trying to send the settings.',
                    `${(0, builders_1.codeBlock)('js', e.message)}`,
                ].join(' '),
                ephemeral: true,
            });
        }
    }
}
exports.default = SettingsCommand;
