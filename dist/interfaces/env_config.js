"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientConfig = exports.serverConfig = void 0;
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const getConfig = () => {
    return {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
        BASE_URL: process.env.BASE_URL,
        CONFIGURATION: process.env.CONFIGURATION,
        DOSSIER: process.env.DOSSIER,
        ITEMS: process.env.ITEMS,
        MONGO_URI: process.env.MONGO_URI,
        API_KEY: process.env.API_KEY,
        BOT_TOKEN: process.env.BOT_TOKEN,
        DEV_BOT_TOKEN: process.env.DEV_BOT_TOKEN,
        APPLICATION_ID: process.env.APPLICATION_ID,
        DEV_APPLICATION_ID: process.env.DEV_APPLICATION_ID,
        BOT_DEV: process.env.BOT_DEV,
        GITHUB_REPO: process.env.GITHUB_REPO,
        DEV_DISCORD: process.env.DEV_DISCORD,
        BATTLEMETRICS: process.env.BATTLEMETRICS,
        BM_API_STANDARD: process.env.BM_API_STANDARD,
        BM_API_GENESIS: process.env.BM_API_GENESIS,
        WELCOME_IMAGE: process.env.WELCOME_IMAGE,
        ARK_ICON: process.env.ARK_ICON,
        WYVERN_MILK: process.env.WYVERN_MILK,
        GASOLINE: process.env.GASOLINE,
        TEK_GEN: process.env.TEK_GEN,
        ELEMENT: process.env.ELEMENT,
        ELEMENT_SHARD: process.env.ELEMENT_SHARD,
        CLONING_CHAMBER: process.env.CLONING_CHAMBER,
        ROLE_ADDED: process.env.ROLE_ADDED,
        ROLE_REMOVED: process.env.ROLE_REMOVED,
    };
};
const getServerConfig = (config) => {
    const keysToGet = ['NODE_ENV', 'PORT', 'MONGO_URI', 'API_KEY'];
    for (const [key, value] of Object.entries(config)) {
        if (!keysToGet.includes(key))
            continue;
    }
    return config;
};
const getClientConfig = (config) => {
    const keysToSkip = ['NODE_ENV', 'PORT', 'MONGO_URI'];
    for (const [key, value] of Object.entries(config)) {
        if (keysToSkip.includes(key))
            continue;
    }
    return config;
};
const config = getConfig();
exports.serverConfig = getServerConfig(config);
exports.clientConfig = getClientConfig(config);
