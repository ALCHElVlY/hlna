"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const structures_1 = require("../../structures");
const functions_1 = tslib_1.__importDefault(require("../../utils/functions"));
const enums_1 = require("../../../enums");
const { ERROR_EMBED, TEKGEN_EMBED } = enums_1.EmbedEnum;
class TekgenCommand extends structures_1.SlashCommand {
    constructor(client) {
        super(client, {
            data: new builders_1.SlashCommandBuilder()
                .setName('tekgen')
                .setDescription('Calculates the time before a tek generator runs out of fuel.')
                .setDefaultMemberPermissions(null)
                .addIntegerOption((option) => option
                .setName('element')
                .setDescription('The amount of element in the tek generator')
                .setRequired(true))
                .addIntegerOption((option) => option
                .setName('radius')
                .setDescription('The radius setting of the tek generator.')
                .setRequired(true)
                .addChoices({ name: '1', value: 1 }, { name: '2', value: 2 }, { name: '5', value: 5 }, { name: '10', value: 10 })),
            category: 'ARK',
            permissions: ['User'],
        });
    }
    async execute(interaction) {
        const element = interaction.options.getInteger('element');
        const radius = interaction.options.getInteger('radius');
        const multiplier = functions_1.default.SetMultiplier(radius);
        const consumption_rate = (element / multiplier) * 18 * 3600;
        try {
            if (element <= 0) {
                throw Error('Element must be a positive number greater than 0.');
            }
            interaction.reply({
                embeds: [TEKGEN_EMBED(this.client, element, radius, consumption_rate)],
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
exports.default = TekgenCommand;
