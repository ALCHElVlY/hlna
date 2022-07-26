"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
const env_config_1 = require("../../interfaces/env_config");
class GuildCreateEvent extends structures_1.Event {
    constructor(client) {
        super(client, 'guildCreate');
    }
    async run(guild) {
        const guildSettings = new structures_1.GuildSettings(this.client);
        structures_1.AxiosPrivate.post(env_config_1.clientConfig.CONFIGURATION, { guild_id: guild.id })
            .then(() => console.log('Guild Added', {
            Name: guild.name,
            ID: guild.id,
        }))
            .catch((e) => console.log(e));
        this.client.settings.set(guild.id, guildSettings.getDefaults);
    }
}
exports.default = GuildCreateEvent;
