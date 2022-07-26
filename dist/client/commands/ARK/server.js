"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const structures_1 = require("../../structures");
const functions_1 = tslib_1.__importDefault(require("../../utils/functions"));
const enums_1 = require("../../../enums");
const { ERROR_EMBED } = enums_1.EmbedEnum;
class ServerCommand extends structures_1.SlashCommand {
    constructor(client) {
        super(client, {
            data: new builders_1.SlashCommandBuilder()
                .setName('server')
                .setDescription('Query the battlemetrics API for ARK Official server info.')
                .setDefaultMemberPermissions(null)
                .addStringOption((option) => option
                .setName('name')
                .setDescription('The name of the server to search for')
                .setRequired(true)),
            category: 'ARK',
            permissions: ['User'],
        });
    }
    async execute(interaction) {
        const value = interaction.options.getString('name');
        const data = await functions_1.default.FetchServerData(this.client, interaction, value);
        try {
            interaction.reply({
                embeds: [data],
                ephemeral: true,
            });
        }
        catch (e) {
            return interaction.reply({
                embeds: [ERROR_EMBED(this.client, e.message)],
                ephemeral: true,
            });
        }
    }
}
exports.default = ServerCommand;
