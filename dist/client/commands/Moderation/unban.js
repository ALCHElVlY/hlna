"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const structures_1 = require("../../structures");
const enums_1 = require("../../../enums");
const { SUCCESS_EMBED, ERROR_EMBED, BAN_LIST_EMBED } = enums_1.EmbedEnum;
class UnbanCommand extends structures_1.SlashCommand {
    constructor(client) {
        super(client, {
            data: new builders_1.SlashCommandBuilder()
                .setName('unban')
                .setDescription('Manually unban a member from the server, or list all bans.')
                .setDefaultMemberPermissions(null)
                .addSubcommand((subcommand) => subcommand
                .setName('member')
                .setDescription('The member to unban')
                .addUserOption((option) => option
                .setName('target')
                .setDescription('The member')
                .setRequired(true)))
                .addSubcommand((subcommand) => subcommand
                .setName('list')
                .setDescription('List all bans in the server.')),
            category: 'Moderation',
            permissions: ['Moderator'],
        });
    }
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const member = interaction.member;
        const memberToUnban = interaction.options.getMember('member') ?? null;
        const guild = member.guild;
        const guildBans = [];
        try {
            switch (subcommand) {
                case 'member':
                    guild.members.unban(member).then(async () => {
                        await interaction.reply({
                            embeds: [
                                SUCCESS_EMBED(this.client, `${(0, builders_1.userMention)(memberToUnban.id)} has been unbanned.`),
                            ],
                            ephemeral: true,
                        });
                    });
                    break;
                case 'list':
                    guild.bans.fetch().then(async (bans) => {
                        if (bans.size <= 0) {
                            return interaction.reply({
                                embeds: [
                                    ERROR_EMBED(this.client, 'there are currently no bans for this server!'),
                                ],
                                ephemeral: true,
                            });
                        }
                        bans.forEach((ban) => {
                            const data = {
                                user: {
                                    name: ban.user.username,
                                    id: ban.user.id,
                                },
                                reason: ban.reason,
                            };
                            guildBans.push(data);
                        });
                        await interaction.reply({
                            embeds: [BAN_LIST_EMBED(guild, guildBans)],
                            ephemeral: true,
                        });
                    });
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
exports.default = UnbanCommand;
