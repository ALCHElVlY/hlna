"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const structures_1 = require("../../structures");
const enums_1 = require("../../../enums");
const functions_1 = tslib_1.__importDefault(require("../../utils/functions"));
const { ERROR_EMBED, ADD_MUTE_EMBED } = enums_1.EmbedEnum;
class MuteCommand extends structures_1.SlashCommand {
    constructor(client) {
        super(client, {
            data: new builders_1.SlashCommandBuilder()
                .setName('mute')
                .setDescription('Bans a member from the server.')
                .setDefaultMemberPermissions(null)
                .addUserOption((option) => option
                .setName('member')
                .setDescription('The member to mute.')
                .setRequired(true))
                .addStringOption((option) => option
                .setName('time')
                .setDescription('The time to mute the member for. (ex: 1m, 1h, 1d, 1w)')
                .setRequired(false)),
            category: 'Moderation',
            permissions: ['Moderator'],
        });
    }
    async execute(interaction) {
        const settings = this.client.settings.get(interaction.guild?.id);
        const muteRole = interaction.guild?.roles.cache.get(settings['roles'].mute_role);
        const memberToMute = interaction.options.getMember('member');
        const member = interaction.member;
        const time = interaction.options.getString('time');
        const muteDuration = time
            ? functions_1.default.FormatMuteTime(time)
            : undefined;
        const muteTime = 31536000000 * 100;
        try {
            if (!member.permissions.has(discord_js_1.Permissions.FLAGS.MODERATE_MEMBERS)) {
                throw Error('You do not have the required permissions to mute members.');
            }
            if (memberToMute.permissions.has(discord_js_1.Permissions.FLAGS.MODERATE_MEMBERS) &&
                !member.permissions.has(discord_js_1.Permissions.FLAGS.ADMINISTRATOR)) {
                throw new Error('You cannot mute an administrator.');
            }
            if (member.id === interaction.client.user?.id) {
                throw new Error('You cannot mute me!');
            }
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
        }
        catch (e) {
            interaction.reply({
                embeds: [ERROR_EMBED(this.client, e.message)],
                ephemeral: true,
            });
        }
    }
}
exports.default = MuteCommand;
