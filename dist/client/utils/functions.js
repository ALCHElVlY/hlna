"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const builders_1 = require("@discordjs/builders");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const path_1 = tslib_1.__importDefault(require("path"));
const index_1 = require("../structures/index");
const env_config_1 = require("../../interfaces/env_config");
const enums_1 = require("../../enums");
const unicodeEmojis_json_1 = tslib_1.__importDefault(require("./unicodeEmojis.json"));
class ClientFunctions {
    static async GetArkStatus(client) {
        const response = await (0, node_fetch_1.default)('http://arkdedicated.com/officialserverstatus.ini', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const results = await response.text();
        const status = this.FormatGameStatus(results);
        client.user?.setActivity(`ARK: ${status}`, {
            type: 'WATCHING',
        });
    }
    static async GetOfficialRates() {
        const keyRegex = new RegExp(/[\d=.]/gm);
        const valueRegex = new RegExp(/[a-zA-Z|=]/gm);
        const OfficialRates = new Map();
        const response = await (0, node_fetch_1.default)('http://arkdedicated.com/dynamicconfig.ini', {
            method: 'GET',
        });
        if (this.CheckStatus(response)) {
            const data = await response.text();
            const propterties = data.split('\r\n');
            for (let i = 0; i < propterties.length; i++) {
                const key = propterties[i].replace(keyRegex, '');
                const value = propterties[i].replace(valueRegex, '');
                OfficialRates.set(key, value);
            }
        }
        return OfficialRates;
    }
    static FormatGameStatus(status) {
        const regex = /ark\sofficial.*?>(.*?)<\/>/gim;
        const match = regex.exec(status);
        if (match) {
            return match[1];
        }
        return 'Unknown';
    }
    static RefreshGameStatus(client) {
        setInterval(async () => {
            await this.GetArkStatus(client);
        }, 30000);
    }
    static async Sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    static HighLight(text) {
        return `\`${text}\``;
    }
    static async AwaitReply(interaction, question, limit = 60000) {
        const filter = (m) => {
            if (m.author.id === interaction.user.id)
                return true;
            return false;
        };
        await interaction.channel?.send({ content: question });
        try {
            const collected = await interaction.channel?.awaitMessages({
                filter,
                max: 1,
                maxProcessed: 1,
                time: limit,
                errors: ['time'],
            });
            return collected?.first();
        }
        catch (e) {
            return false;
        }
    }
    static async AwaitConfirmation(interaction, question) {
        const response = await this.AwaitReply(interaction, `${interaction?.user} ${question}` + ' **(yes/no)**');
        if (['y', 'yes'].includes(response.content)) {
            return Promise.resolve(true);
        }
        return Promise.reject(false);
    }
    static GetMentions(message) {
        let hasMention = false;
        const mentions = [];
        if (message.mentions.users.size <= 0) {
            hasMention = false;
        }
        else {
            hasMention = true;
            const userMention = message.mentions.users?.first();
            mentions.push(userMention?.id);
        }
        if (message.mentions.roles.size <= 0) {
            hasMention = false;
        }
        else {
            hasMention = true;
            const roleMention = message.mentions.roles?.first();
            mentions.push(roleMention?.id);
        }
        if (message.mentions.channels.size === 0) {
            hasMention = false;
        }
        else {
            hasMention = true;
            const channelMention = message.mentions.channels?.first();
            mentions.push(channelMention?.id);
        }
        switch (hasMention) {
            case true:
                return mentions[0];
            case false:
                return message.content;
        }
    }
    static async FetchServerData(client, interaction, server) {
        const match = server.match(/\d+/gm);
        const standardFilter = `${env_config_1.clientConfig.BM_API_STANDARD}${server}`;
        const freeBuildFilter = `${env_config_1.clientConfig.BM_API_GENESIS}${match}`;
        const GenServers = ['genone708', 'genone706', 'genone705'];
        const IsFreeBuildMap = GenServers.includes(server);
        try {
            switch (IsFreeBuildMap) {
                case true:
                    const freeBuildResponse = await (0, node_fetch_1.default)(freeBuildFilter);
                    const freeBuildData = await freeBuildResponse.json();
                    interaction.reply({
                        embeds: [
                            enums_1.EmbedEnum.SERVER_EMBED(client, freeBuildData.data[0].attributes),
                        ],
                        ephemeral: true,
                    });
                    break;
                default:
                    const standardResponse = await (0, node_fetch_1.default)(standardFilter);
                    const standardData = await standardResponse.json();
                    interaction.reply({
                        embeds: [
                            enums_1.EmbedEnum.SERVER_EMBED(client, standardData.data[0].attributes),
                        ],
                        ephemeral: true,
                    });
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    static SetMultiplier(radius) {
        const multiplier_setting = [];
        switch (radius) {
            case 1:
                multiplier_setting.push('1');
                break;
            case 2:
                multiplier_setting.push('1.33');
                break;
            case 5:
                multiplier_setting.push('2.32');
                break;
            case 10:
                multiplier_setting.push('3.97');
                break;
            default:
                throw new Error('Invalid radius');
        }
        return Number(multiplier_setting[0]);
    }
    static FormatMuteTime(time) {
        const duration = time.match(/(\d)/gm);
        const timeUnit = time.match(/(\D)/gim);
        switch (timeUnit[0]) {
            case 's':
                return duration[0] * 1000;
            case 'm':
                return duration[0] * (1000 * 60);
            case 'h':
                return duration[0] * (1000 * 3600);
            case 'd':
                return duration[0] * (1000 * 86400);
            case 'w':
                return duration[0] * (1000 * 604800);
            default:
                throw new Error('Duration out of range. Accepted units are [s, m, h, d, w]');
        }
    }
    static Calculate(num) {
        const days = Math.floor(num / 86400);
        const hours = Math.floor(num / 3600) % 24;
        const minutes = Math.floor(num / 60) % 60;
        const seconds = Math.round(num % 60);
        return [
            `${(0, builders_1.bold)(days.toString())}d ${(0, builders_1.bold)(hours.toString())}h`,
            `${(0, builders_1.bold)(minutes.toString())}m ${(0, builders_1.bold)(seconds.toString())}s`,
        ].join(' ');
    }
    static CalculateAccountAge(createdDate) {
        const years = Math.floor(createdDate / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((createdDate / (1000 * 60 * 60 * 24 * 30)) % 12);
        const days = Math.floor((createdDate / (1000 * 60 * 60 * 24)) % 30);
        const hours = Math.floor((createdDate / (1000 * 60 * 60)) % 24);
        return `${years}Y ${months}M ${days}D ${hours}H`;
    }
    static FindEmoji(client, emoji) {
        let emojiToReturn;
        try {
            console.log(unicodeEmojis_json_1.default);
            const customEmoji = client.emojis.cache.find((e) => e.name === emoji);
            if (customEmoji) {
                emojiToReturn = customEmoji;
            }
        }
        catch (e) {
            console.log(e);
        }
        return emojiToReturn;
    }
    static CheckStatus(res) {
        let status = false;
        if (res.ok) {
            status = true;
        }
        else {
            status = false;
            throw Error(res.statusText);
        }
        return status;
    }
    static ToProperCase(text) {
        return (text ? text.toLowerCase() : text).replace(/(^|[\s\xA0])[^\s\xA0]/g, (s) => {
            return s.toUpperCase();
        });
    }
    static GenerateAuthToken(length = 24) {
        const token = crypto_1.default.randomBytes(length).toString('hex');
        try {
            console.log(token);
        }
        catch (e) {
            console.log(e);
        }
    }
    static async DeployAllCommands() {
        const commands = new discord_js_1.Collection();
        const commandsToRegister = [];
        const rest = new rest_1.REST({ version: '9' }).setToken(env_config_1.clientConfig.DEV_BOT_TOKEN);
        const applicationID = env_config_1.clientConfig.DEV_APPLICATION_ID;
        const logger = new index_1.Logger();
        const load = async (directory) => {
            const commandDir = directory || path_1.default.join(__dirname, '..', 'commands');
            const commandFolder = (0, node_fs_1.readdirSync)(commandDir);
            try {
                commandFolder.forEach(async (file) => {
                    const commandName = file.replace(/^.*\\/gim, '').split('.')[0];
                    const filePath = path_1.default.join(commandDir, file);
                    const stats = await (0, promises_1.stat)(filePath);
                    if (stats.isDirectory()) {
                        load(filePath);
                    }
                    if (stats.isFile() &&
                        (file.endsWith('.ts') || file.endsWith('.js'))) {
                        const SlashCommand = (await Promise.resolve().then(() => tslib_1.__importStar(require(filePath)))).default;
                        const command = new SlashCommand();
                        commands.set(commandName, command.info);
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        };
        await load();
        await this.Sleep(1000);
        for (const value of commands.values()) {
            commandsToRegister.push(value.data.toJSON());
        }
        await rest.put(v9_1.Routes.applicationCommands(applicationID), {
            body: commandsToRegister,
        });
        await logger.Log('Successfully registered application commands');
    }
    static async DeployGuildOnlyCommands(guildID) {
        const commands = new discord_js_1.Collection();
        const commandsToRegister = [];
        const rest = new rest_1.REST({ version: '9' }).setToken(env_config_1.clientConfig.DEV_BOT_TOKEN);
        const applicationID = env_config_1.clientConfig.DEV_APPLICATION_ID;
        const logger = new index_1.Logger();
        const load = async (directory) => {
            const commandDir = directory || path_1.default.join(__dirname, '..', 'commands');
            const commandFolder = (0, node_fs_1.readdirSync)(commandDir);
            try {
                commandFolder.forEach(async (file) => {
                    const commandName = file.replace(/^.*\\/gim, '').split('.')[0];
                    const filePath = path_1.default.join(commandDir, file);
                    const stats = await (0, promises_1.stat)(filePath);
                    if (stats.isDirectory()) {
                        load(filePath);
                    }
                    if (stats.isFile() &&
                        (file.endsWith('.ts') || file.endsWith('.js'))) {
                        const SlashCommand = (await Promise.resolve().then(() => tslib_1.__importStar(require(filePath)))).default;
                        const command = new SlashCommand();
                        commands.set(commandName, command.info);
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        };
        await load();
        await this.Sleep(1000);
        for (const value of commands.values()) {
            commandsToRegister.push(value.data.toJSON());
        }
        await rest.put(v9_1.Routes.applicationGuildCommands(applicationID, guildID), {
            body: commandsToRegister,
        });
        await logger.Log(`Successfully registered application commands to guild ${guildID.toString()}`);
    }
    static async DeleteAllCommands() {
        const rest = new rest_1.REST({ version: '9' }).setToken(env_config_1.clientConfig.DEV_BOT_TOKEN);
        const applicationID = env_config_1.clientConfig.DEV_APPLICATION_ID;
        const logger = new index_1.Logger();
        await this.Sleep(1000);
        await rest.put(v9_1.Routes.applicationCommands(applicationID), {
            body: [],
        });
        await logger.Log('Successfully deleted all slash commands');
    }
    static async DeleteGuildOnlyCommands(guildID) {
        const rest = new rest_1.REST({ version: '9' }).setToken(env_config_1.clientConfig.DEV_BOT_TOKEN);
        const applicationID = env_config_1.clientConfig.DEV_APPLICATION_ID;
        const logger = new index_1.Logger();
        await this.Sleep(1000);
        await rest.put(v9_1.Routes.applicationGuildCommands(applicationID, guildID), {
            body: [],
        });
        await logger.Log('Successfully deleted all slash commands from this guild');
    }
}
exports.default = ClientFunctions;
