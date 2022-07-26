"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const enums_1 = require("../../enums");
const format_1 = require("../utils/format");
const functions_1 = tslib_1.__importDefault(require("../utils/functions"));
const { ERROR_EMBED, ROLE_MENU_EMBED } = enums_1.EmbedEnum;
class RoleMenu {
    client;
    constructor(client) {
        this.client = client;
    }
    async AddRole(member, roles) {
        if (roles.length <= 0)
            return;
        for (const role of roles) {
            if (!member.roles.cache.has(role.id)) {
                await member.roles.add(role);
            }
            else {
                await this.RemoveRole(member, role);
            }
        }
    }
    async RemoveRole(member, role) {
        if (!member.roles.cache.has(role.id))
            return;
        await member.roles.remove(role);
    }
    async Setup(interaction, channel) {
        const msgCollectorFilter = (msg) => msg.author.id === interaction.user.id;
        const guild = interaction?.guild;
        const options = [];
        const promptMsg = [
            'Enter the roles you wish to add to the menu options',
            "Type '.iamdone' when you are finished. '.stop' to cancel.",
        ].join('\n');
        await interaction.reply({
            content: (0, builders_1.codeBlock)(promptMsg),
        });
        const collector = new discord_js_1.MessageCollector(interaction.channel, {
            filter: msgCollectorFilter,
            time: 10 * 60 * 1000,
        });
        collector.on('collect', async (msg) => {
            if (msg.author.bot)
                return;
            if (msg.content.toLowerCase() === '.iamdone') {
                collector.stop('Done command was issued. Collector stopped!');
                return;
            }
            if (msg.content.toLowerCase() === '.stop') {
                collector.stop(`${msg.author.tag} manual stop issued, canceling setup!`);
                return;
            }
            const roleName = msg.content;
            if (!roleName)
                return;
            const role = msg.guild?.roles.cache.find((r) => r.name.toLowerCase() === roleName.toLowerCase());
            if (!role) {
                return channel.send({
                    embeds: [
                        ERROR_EMBED(this.client, `Role ${functions_1.default.HighLight(roleName)} does not exist in this guild!`),
                    ],
                });
            }
            options.push({ role: role });
        });
        collector.on('end', async (collected, reason) => {
            if (reason === 'Done command was issued. Collector stopped!') {
                const roleMenu = (0, format_1.rolemenu)(options);
                const componentRow = (0, format_1.row)().addComponents(roleMenu);
                await this.ClearSetup(this.client, collected);
                return await channel.send({
                    embeds: [ROLE_MENU_EMBED(guild)],
                    components: [componentRow],
                });
            }
            return;
        });
    }
    async ClearSetup(client, messages) {
        const channelID = [];
        messages.forEach((message) => {
            if (channelID.includes(message.channelId))
                return;
            channelID.push(message.channelId);
        });
        const channel = client.channels.cache.get(channelID[0]);
        channel.messages.cache.forEach(async (msg) => {
            await msg.delete();
        });
    }
}
exports.default = RoleMenu;
