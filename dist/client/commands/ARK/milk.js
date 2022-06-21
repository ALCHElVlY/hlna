"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const structures_1 = require("../../structures");
const enums_1 = require("../../../enums");
const { ERROR_EMBED, MILK_EMBED } = enums_1.EmbedEnum;
class MilkCommand extends structures_1.SlashCommand {
    constructor(client) {
        super(client, {
            data: new builders_1.SlashCommandBuilder()
                .setName('milk')
                .setDescription('Calculates the time before you can feed a baby Wyvern again.')
                .setDefaultMemberPermissions(null)
                .addIntegerOption((option) => option
                .setName('food')
                .setDescription('The food level of the baby Wyvern')
                .setRequired(true)),
            category: 'ARK',
            permissions: ['User'],
        });
    }
    async execute(interaction) {
        const food_level = interaction.options.getInteger('food');
        const multiplier = 10;
        const consumption_rate = food_level * multiplier;
        try {
            if (food_level <= 0) {
                throw Error('Food level must be a positive number greater than 0.');
            }
            interaction.reply({
                embeds: [MILK_EMBED(this.client, food_level, consumption_rate)],
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
exports.default = MilkCommand;
