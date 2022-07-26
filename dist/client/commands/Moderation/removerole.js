"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const structures_1 = require("../../structures");
const enums_1 = require("../../../enums");
const { ERROR_EMBED, REMOVE_ROLE_EMBED } = enums_1.EmbedEnum;
class RemoveRoleCommand extends structures_1.SlashCommand {
    constructor(client) {
        super(client, {
            data: new builders_1.SlashCommandBuilder()
                .setName('removerole')
                .setDescription('Manually removes a role from a member.')
                .setDefaultMemberPermissions(null)
                .addUserOption((option) => option
                .setName('member')
                .setDescription('The member to remove a role from')
                .setRequired(true))
                .addRoleOption((option) => option
                .setName('role')
                .setDescription('The role to remove from the member')
                .setRequired(true)),
            category: 'Moderation',
            permissions: ['Moderator'],
        });
    }
    async execute(interaction) {
        const member = interaction.options.getMember('member');
        const role = interaction.options.getRole('role');
        try {
            if (!member.roles.cache.some((r) => r.name === role.name))
                return;
            await member.roles.remove(role.id).then(async () => {
                await interaction.reply({
                    embeds: [REMOVE_ROLE_EMBED(this.client, member, role)],
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
exports.default = RemoveRoleCommand;
