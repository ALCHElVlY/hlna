"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const structures_1 = require("../../structures");
const functions_1 = tslib_1.__importDefault(require("../../utils/functions"));
const env_config_1 = require("../../../interfaces/env_config");
const enums_1 = require("../../../enums");
const { ERROR_EMBED, CLONE_EMBED } = enums_1.EmbedEnum;
class CloneCommand extends structures_1.SlashCommand {
    constructor(client) {
        super(client, {
            data: new builders_1.SlashCommandBuilder()
                .setName('clone')
                .setDescription('Calculates the time and cost of cloning a creature.')
                .setDefaultMemberPermissions(null)
                .addStringOption((option) => option
                .setName('name')
                .setDescription('The name of the creature to clone')
                .setRequired(true))
                .addIntegerOption((option) => option
                .setName('level')
                .setDescription('The level of the creature being cloned')
                .setRequired(true)),
            category: 'ARK',
            permissions: ['User'],
        });
    }
    async execute(interaction) {
        const creatureName = interaction.options.getString('name');
        const CreateName = functions_1.default.ToProperCase(creatureName);
        const level = interaction.options.getInteger('level');
        const OfficialRates = await functions_1.default.GetOfficialRates();
        const mature_rate = await OfficialRates.get('BabyMatureSpeedMultiplier');
        const results = await structures_1.AxiosPrivate.get(`${env_config_1.clientConfig.DOSSIER}/${CreateName}`);
        try {
            const BaseElementCost = results.data.base_cost;
            const CostPerLevel = results.data.per_level_cost;
            const CostForLevel = level * CostPerLevel;
            const clone_cost = CostForLevel + BaseElementCost;
            const clone_time = clone_cost * (7 / mature_rate);
            if (results.data === null) {
                throw new Error(`${functions_1.default.HighLight(CreateName)} not found in the database.`);
            }
            return interaction.reply({
                embeds: [
                    CLONE_EMBED(this.client, creatureName, level, clone_cost, clone_time, mature_rate),
                ],
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
exports.default = CloneCommand;
