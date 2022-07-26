"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const structures_1 = require("../../structures");
const enums_1 = require("../../../enums");
const { ERROR_EMBED } = enums_1.EmbedEnum;
class RoleMenuCommand extends structures_1.SlashCommand {
    constructor(client) {
        super(client, {
            data: new builders_1.SlashCommandBuilder()
                .setName('rolemenu')
                .setDescription('Create a self-assignable role menu.')
                .setDefaultMemberPermissions(null)
                .addSubcommand((command) => command
                .setName('setup')
                .setDescription('Setup a role menu')
                .addChannelOption((option) => option
                .setName('channel')
                .setDescription('The channel to send the role menu to')
                .setRequired(false)))
                .addSubcommand((command) => command
                .setName('edit')
                .setDescription('Edit the options of an existing role menu')
                .addStringOption((option) => option
                .setName('id')
                .setDescription('The ID of the role menu to edit')
                .setRequired(true))),
            category: 'Configuration',
            permissions: ['Server Owner'],
        });
    }
    async execute(interaction) {
        const rolemenu = new structures_1.RoleMenu(this.client);
        const subcommand = interaction.options.getSubcommand();
        const channel = (interaction.options.getChannel('channel') ??
            interaction.channel);
        const menuID = interaction.options.getString('id') ?? null;
        try {
            switch (subcommand) {
                case 'setup':
                    await rolemenu.Setup(interaction, channel);
                    break;
                case 'edit':
                    console.log(menuID);
                    break;
            }
        }
        catch (e) {
            return interaction.reply({
                embeds: [ERROR_EMBED(this.client, e.message)],
                ephemeral: true,
            });
        }
    }
}
exports.default = RoleMenuCommand;
