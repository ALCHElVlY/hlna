"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const structures_1 = require("../../structures");
const enums_1 = require("../../../enums");
const { SUCCESS_EMBED, ERROR_EMBED, KICK_DM_EMBED } = enums_1.EmbedEnum;
class KickCommand extends structures_1.SlashCommand {
    constructor(client) {
        super(client, {
            data: new builders_1.SlashCommandBuilder()
                .setName('kick')
                .setDescription('Manually kicks a member from the server.')
                .setDefaultMemberPermissions(null)
                .addUserOption((option) => option
                .setName('member')
                .setDescription('The member to kick')
                .setRequired(true))
                .addStringOption((option) => option
                .setName('reason')
                .setDescription('The reason for kicking the member')
                .setRequired(true)),
            category: 'Moderation',
            permissions: ['Moderator'],
        });
    }
    async execute(interaction) {
        const member = interaction.options.getMember('member');
        const serverOwner = interaction.member;
        const reason = interaction.options.getString('reason');
        try {
            if (member.id === serverOwner.guild.ownerId) {
                return interaction.reply({
                    embeds: [
                        ERROR_EMBED(this.client, 'You cannot kick the server owner.'),
                    ],
                    ephemeral: true,
                });
            }
            if (member.id === interaction.user.id) {
                return interaction.reply({
                    embeds: [ERROR_EMBED(this.client, 'You cannot kick yourself.')],
                    ephemeral: true,
                });
            }
            if (member.id === this.client.user?.id) {
                return interaction.reply({
                    embeds: [ERROR_EMBED(this.client, 'You cannot kick me!')],
                    ephemeral: true,
                });
            }
            if (!interaction.guild?.me?.permissions.has(discord_js_1.Permissions.FLAGS.KICK_MEMBERS)) {
                return interaction.reply({
                    embeds: [
                        ERROR_EMBED(this.client, 'I do not have the permission to kick users.'),
                    ],
                    ephemeral: true,
                });
            }
            if (!interaction.memberPermissions?.has(discord_js_1.Permissions.FLAGS.KICK_MEMBERS)) {
                return interaction.reply({
                    embeds: [
                        ERROR_EMBED(this.client, 'You do not have the permission to kick users.'),
                    ],
                    ephemeral: true,
                });
            }
            if (reason.length < 1 || reason.length > 25) {
                return interaction.reply({
                    embeds: [
                        ERROR_EMBED(this.client, 'The reason must be between 1 and 25 characters.'),
                    ],
                    ephemeral: true,
                });
            }
            await member
                .send({
                embeds: [KICK_DM_EMBED(interaction.guild, reason)],
            })
                .then(async () => await member.kick(reason))
                .catch((e) => '');
            return await interaction.reply({
                embeds: [
                    SUCCESS_EMBED(this.client, `Successfully kicked ${member.user.tag}`),
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
exports.default = KickCommand;
