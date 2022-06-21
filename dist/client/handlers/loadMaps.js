"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
async function loadMaps(client) {
    client.commands = new discord_js_1.Collection();
    client.settings = new discord_js_1.Collection();
}
exports.default = loadMaps;
