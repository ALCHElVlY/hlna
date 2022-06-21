"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const path = tslib_1.__importStar(require("path"));
const loadCommand_1 = tslib_1.__importDefault(require("../utils/loadCommand"));
class DiscordClient extends discord_js_1.Client {
    client;
    commands;
    settings;
    constructor(intents, allowedMentions, partials) {
        super({ intents, allowedMentions, partials });
        this.client = this;
        this.commands = new discord_js_1.Collection();
        this.settings = new discord_js_1.Collection();
    }
    async LoadCommands(dir) {
        const commandPath = dir || path.join(__dirname, '..', 'commands');
        const commandFolder = (0, node_fs_1.readdirSync)(commandPath);
        try {
            commandFolder.forEach(async (file) => {
                const filePath = path.join(commandPath, file);
                const stats = await (0, promises_1.stat)(filePath);
                if (stats.isDirectory()) {
                    this.LoadCommands(filePath);
                }
                if (stats.isFile() &&
                    (file.endsWith('.ts') || file.endsWith('.js'))) {
                    await (0, loadCommand_1.default)(this, filePath);
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    async LoadEvents() {
        const eventPath = path.join(__dirname, '..', 'events');
        const eventFolder = (0, node_fs_1.readdirSync)(eventPath);
        console.log(`Loading a total of ${eventFolder.length} events.`);
        eventFolder.forEach(async (file) => {
            const DiscordClientEvent = (await Promise.resolve().then(() => tslib_1.__importStar(require(`${eventPath}/${file}`)))).default;
            const event = new DiscordClientEvent(this.client);
            console.log(`Loading Event: ${event.name}`);
            this.client.on(event.name, event.run.bind(event));
        });
    }
    async Login(token) {
        await this.LoadEvents();
        await this.LoadCommands();
        await this.login(token);
    }
}
exports.default = DiscordClient;
