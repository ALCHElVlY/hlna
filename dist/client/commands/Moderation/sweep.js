"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const structures_1 = require("../../structures");
const enums_1 = require("../../../enums");
const { SUCCESS_EMBED, ERROR_EMBED } = enums_1.EmbedEnum;
class SweepCommand extends structures_1.SlashCommand {
    constructor(client) {
        super(client, {
            data: new builders_1.SlashCommandBuilder()
                .setName('sweep')
                .setDescription('Bulk delete x amount of messages from a channel.')
                .setDefaultMemberPermissions(null)
                .addIntegerOption((option) => option
                .setName('amount')
                .setDescription('The amount of messages to delete')
                .setRequired(true))
                .addChannelOption((option) => option
                .setName('channel')
                .setDescription('The channel to delete messages from')
                .setRequired(false)),
            category: 'Moderation',
            permissions: ['Moderator'],
        });
    }
    async execute(interaction) {
        const logger = new structures_1.Logger();
        const settings = this.client.settings.get(interaction.guild?.id);
        const amount = interaction.options.getInteger('amount');
        let channel = interaction.options.getChannel('channel')
            ?? undefined;
        try {
            if (amount < 1 || amount > 100) {
                return interaction.reply({
                    embeds: [ERROR_EMBED(this.client, 'Amount must be between 1 and 100.')],
                    ephemeral: true,
                });
            }
            if (!channel) {
                channel = interaction.channel;
                await channel.bulkDelete(amount, true);
                await interaction.reply({
                    embeds: [
                        SUCCESS_EMBED(this.client, `${amount} messages have were deleted from this channel.`),
                    ],
                    ephemeral: true,
                });
                if (settings.log_channels.length <= 0)
                    return;
                const channelID = settings.log_channels.find((c) => c.log_type === 'message_bulk_delete').channel_id;
                const logChannel = this.client.channels.cache.get(channelID);
                if (!logChannel)
                    return;
                try {
                    return logger.Log([interaction, amount], 'message_bulk_delete', logChannel);
                }
                catch (e) {
                    console.log(e);
                }
            }
            else {
                await channel.bulkDelete(amount, true);
                await interaction.reply({
                    embeds: [
                        SUCCESS_EMBED(this.client, `${amount} messages were deleted from ${(0, builders_1.channelMention)(channel.id)}.`),
                    ],
                    ephemeral: true,
                });
                if (settings.log_channels.length <= 0)
                    return;
                const channelID = settings.log_channels.find((c) => c.log_type === 'message_bulk_delete').channel_id;
                const logChannel = this.client.channels.cache.get(channelID);
                if (!logChannel)
                    return;
                try {
                    await logger.Log([interaction, amount], 'message_bulk_delete', logChannel);
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
        catch (e) {
            const noLogChannelError = "Cannot read properties of undefined (reading 'channel_id')";
            if (e.message === noLogChannelError)
                return;
            return await interaction.reply({
                embeds: [ERROR_EMBED(this.client, e.message)],
                ephemeral: true,
            });
        }
    }
}
exports.default = SweepCommand;
