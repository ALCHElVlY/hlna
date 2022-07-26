"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const structures_1 = require("../../structures");
const enums_1 = require("../../../enums");
const { ERROR_EMBED, ADD_ROLE_EMBED } = enums_1.EmbedEnum;
class AddRoleCommand extends structures_1.SlashCommand {
    constructor(client) {
        super(client, {
            data: new builders_1.SlashCommandBuilder()
                .setName('addrole')
                .setDescription('Manually adds a role to a member.')
                .setDefaultMemberPermissions(null)
                .addUserOption((option) => option
                .setName('member')
                .setDescription('The member to add the role to.')
                .setRequired(true))
                .addRoleOption((option) => option
                .setName('role')
                .setDescription('The role to add to the member.')
                .setRequired(true)),
            category: 'Moderation',
            permissions: ['Moderator'],
        });
    }
    async execute(interaction) {
        const member = interaction.options.getMember('member');
        const role = interaction.options.getRole('role');
        try {
            if (member.roles.cache.some((r) => r.name === role.name))
                return;
            await member.roles.add(role).then(async () => {
                await interaction.reply({
                    embeds: [ADD_ROLE_EMBED(this.client, member, role)],
                    ephemeral: true,
                });
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
exports.default = AddRoleCommand;
