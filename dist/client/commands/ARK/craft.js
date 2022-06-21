"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const structures_1 = require("../../structures");
const functions_1 = tslib_1.__importDefault(require("../../utils/functions"));
const env_config_1 = require("../../../interfaces/env_config");
const enums_1 = require("../../../enums");
const { ERROR_EMBED, CRAFT_EMBED } = enums_1.EmbedEnum;
class CraftCommand extends structures_1.SlashCommand {
    constructor(client) {
        super(client, {
            data: new builders_1.SlashCommandBuilder()
                .setName('craft')
                .setDescription('Calculates the total resource cost of crafting x amount of items.')
                .setDefaultMemberPermissions(null)
                .addStringOption((option) => option
                .setName('item')
                .setDescription('The name of the item to craft')
                .setRequired(true))
                .addIntegerOption((option) => option
                .setName('quantity')
                .setDescription('The quantity of the item to craft')
                .setRequired(true)),
            category: 'ARK',
            permissions: ['User'],
        });
    }
    async execute(interaction) {
        const itemName = interaction.options.getString('item');
        const ItemName = functions_1.default.ToProperCase(itemName)
            .replace(/[s]$/gm, '')
            .replace('Mdsm', 'M.D.S.M.')
            .replace('Mrlm', 'M.R.L.M.')
            .replace('Mdsm', 'M.S.C.M.')
            .replace('Momi', 'M.O.M.I.');
        const itemQty = interaction.options.getInteger('quantity');
        const results = await structures_1.AxiosPrivate.get(`${env_config_1.clientConfig.ITEMS}/${ItemName}`);
        try {
            return interaction.reply({
                embeds: [CRAFT_EMBED(this.client, results.data, itemQty)],
                ephemeral: true,
            });
        }
        catch (e) {
            if (e instanceof TypeError) {
                return interaction.reply({
                    embeds: [
                        ERROR_EMBED(this.client, [
                            'Check the spelling of your search and try again.',
                            'If this message appears again, no data exists in ',
                            `the database for ${functions_1.default.HighLight(itemName)}.`,
                        ].join(' ')),
                    ],
                    ephemeral: true,
                });
            }
        }
    }
}
exports.default = CraftCommand;
