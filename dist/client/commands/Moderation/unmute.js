"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const structures_1 = require("../../structures");
const enums_1 = require("../../../enums");
const { ERROR_EMBED, REMOVE_MUTE_EMBED } = enums_1.EmbedEnum;
class UnmuteCommand extends structures_1.SlashCommand {
    constructor(client) {
        super(client, {
            data: new builders_1.SlashCommandBuilder()
                .setName('unmute')
                .setDescription('Manually unmutes a member.')
                .setDefaultMemberPermissions(null)
                .addUserOption((option) => option
                .setName('member')
                .setDescription('The member to unmute.')
                .setRequired(true)),
            category: 'Moderation',
            permissions: ['Moderator'],
        });
    }
    async execute(interaction) {
        const guild = interaction.guild;
        const settings = this.client.settings.get(guild.id);
        const muteRole = guild.roles.cache.get(settings['roles'].mute_role);
        const member = interaction.options.getMember('member');
        try {
            if (!member.roles.cache.has(muteRole.id)) {
                throw new Error('The member is not muted.');
            }
            await member.roles.remove(muteRole);
            await member.timeout(null);
            await interaction.reply({
                embeds: [REMOVE_MUTE_EMBED(this.client, member)],
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
exports.default = UnmuteCommand;
