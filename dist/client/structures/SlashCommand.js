"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
class SlashCommand {
    client;
    logger;
    info;
    constructor(client, info) {
        this.client = client;
        this.logger = new index_1.Logger();
        this.info = info;
    }
    async onError(interaction, error) {
        return await interaction.reply({
            content: `An error occurred while executing this command: \`${error.message}\``,
            ephemeral: true,
        });
    }
}
exports.default = SlashCommand;
