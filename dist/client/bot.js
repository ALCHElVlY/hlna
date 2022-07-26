"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const tslib_1 = require("tslib");
const DiscordClient_1 = tslib_1.__importDefault(require("./structures/DiscordClient"));
const env_config_1 = require("../interfaces/env_config");
exports.client = new DiscordClient_1.default([
    'GUILDS',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'GUILD_MEMBERS',
    'GUILD_BANS',
    'GUILD_EMOJIS_AND_STICKERS',
    'GUILD_INTEGRATIONS',
    'GUILD_PRESENCES',
], {
    parse: ['users', 'roles'],
    repliedUser: true,
}, ['CHANNEL', 'MESSAGE', 'REACTION', 'GUILD_MEMBER', 'USER']);
exports.client.Login(env_config_1.clientConfig.DEV_BOT_TOKEN);
