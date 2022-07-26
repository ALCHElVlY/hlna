"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const structures_1 = require("../../structures");
const enums_1 = require("../../../enums");
const { ERROR_EMBED, GENERATOR_EMBED } = enums_1.EmbedEnum;
class GeneratorCommand extends structures_1.SlashCommand {
    constructor(client) {
        super(client, {
            data: new builders_1.SlashCommandBuilder()
                .setName('generator')
                .setDescription('Calculates the time before a gas generator runs out of fuel.')
                .setDefaultMemberPermissions(null)
                .addIntegerOption((option) => option
                .setName('fuel')
                .setDescription('The amount of fuel in the generator')
                .setRequired(true)),
            category: 'ARK',
            permissions: ['User'],
        });
    }
    async execute(interaction) {
        const fuel_amount = interaction.options.getInteger('fuel');
        const multiplier = 3600;
        const consumption_rate = fuel_amount * multiplier;
        try {
            if (fuel_amount <= 0) {
                throw Error('Fuel amount must be a positive number greater than 0.');
            }
            interaction.reply({
                embeds: [GENERATOR_EMBED(this.client, fuel_amount, consumption_rate)],
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
exports.default = GeneratorCommand;
