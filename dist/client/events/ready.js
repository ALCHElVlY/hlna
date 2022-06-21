"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const structures_1 = require("../structures");
const functions_1 = tslib_1.__importDefault(require("../utils/functions"));
const env_config_1 = require("../../interfaces/env_config");
class ReadyEvent extends structures_1.Event {
    constructor(client) {
        super(client, 'ready');
    }
    async run() {
        console.log(`${this.client.user?.tag} has successfully connected!`);
        setTimeout(async () => {
            const res = await structures_1.AxiosPrivate.get(env_config_1.clientConfig.CONFIGURATION);
            const cache = new discord_js_1.Collection();
            res.data.forEach((...entry) => {
                const toCache = entry;
                cache.set(entry.guild_id, toCache);
                this.client.settings = cache;
            });
        }, 1000);
        functions_1.default.RefreshGameStatus(this.client);
    }
}
exports.default = ReadyEvent;
