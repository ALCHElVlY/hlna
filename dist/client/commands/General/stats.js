"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const structures_1 = require("../../structures");
const enums_1 = require("../../../enums");
const moment_1 = tslib_1.__importDefault(require("moment"));
require("moment-duration-format");
const { ERROR_EMBED, STATS_EMBED } = enums_1.EmbedEnum;
class StatsCommand extends structures_1.SlashCommand {
    constructor(client) {
        super(client, {
            data: new builders_1.SlashCommandBuilder()
                .setName('stats')
                .setDescription('Gives some useful bot statistics.')
                .setDefaultMemberPermissions(null),
            category: 'General',
            permissions: ['User'],
        });
    }
    async execute(interaction) {
        const duration = moment_1.default
            .duration(this.client.uptime)
            .format(' D [days], H [hrs], m [mins], s [secs]');
        try {
            return interaction.reply({
                embeds: [STATS_EMBED(this.client, duration, discord_js_1.version)],
                ephemeral: true,
            });
        }
        catch (e) {
            return interaction.reply({
                embeds: [ERROR_EMBED(this.client, e.message)],
                ephemeral: true,
            });
        }
    }
}
exports.default = StatsCommand;
