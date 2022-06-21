"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
const env_config_1 = require("../../interfaces/env_config");
class GuildDeleteEvent extends structures_1.Event {
    constructor(client) {
        super(client, 'guildDelete');
    }
    async run(guild) {
        structures_1.AxiosPrivate.delete(env_config_1.clientConfig.CONFIGURATION, {
            data: { guild_id: guild.id },
        })
            .then(() => console.log('Guild Removed', {
            Name: guild.name,
            ID: guild.id,
        }))
            .catch((e) => console.log(e));
        this.client.settings.delete(guild.id);
    }
}
exports.default = GuildDeleteEvent;
