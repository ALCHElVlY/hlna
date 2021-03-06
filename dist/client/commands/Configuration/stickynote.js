"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const structures_1 = require("../../structures");
const enums_1 = require("../../../enums");
const { SUCCESS_EMBED, ERROR_EMBED, STICKYNOTE_EMBED } = enums_1.EmbedEnum;
class StickynoteCommand extends structures_1.SlashCommand {
    constructor(client) {
        super(client, {
            data: new builders_1.SlashCommandBuilder()
                .setName('stickynote')
                .setDescription('Create, clone, or edit an existing sticky note.')
                .setDefaultMemberPermissions(null)
                .addSubcommand((command) => command
                .setName('create')
                .setDescription('Creates a sticky note from scratch')
                .addChannelOption((option) => option
                .setName('channel')
                .setDescription('The channel to send the embed to')
                .setRequired(false))
                .addStringOption((option) => option
                .setName('color')
                .setDescription('The color of the sticky note. Can be a role mention or hex color code')
                .setRequired(false))
                .addStringOption((option) => option
                .setName('title')
                .setDescription('The title of the sticky note')
                .setRequired(false))
                .addStringOption((option) => option
                .setName('description')
                .setDescription('The body of the stickynote')
                .setRequired(false))
                .addStringOption((option) => option
                .setName('image')
                .setDescription('The image to send with the stickynote')
                .setRequired(false))
                .addStringOption((option) => option
                .setName('footer')
                .setDescription('The footer of the stickynote')
                .setRequired(false)))
                .addSubcommand((command) => command
                .setName('clone')
                .setDescription('Clone and resend an existing stickynote.')
                .addStringOption((option) => option
                .setName('id')
                .setDescription('The message ID of the stickynote to clone')
                .setRequired(true)))
                .addSubcommand((command) => command
                .setName('edit')
                .setDescription('Edit an existing stickynote.')
                .addChannelOption((option) => option
                .setName('channel')
                .setDescription('The channel to send the embed to')
                .setRequired(false))
                .addStringOption((option) => option
                .setName('color')
                .setDescription('The color of the sticky note. Can either be a hex color code or a role color')
                .setRequired(false))
                .addStringOption((option) => option
                .setName('title')
                .setDescription('The title of the sticky note')
                .setRequired(false))
                .addStringOption((option) => option
                .setName('description')
                .setDescription('The body of the stickynote')
                .setRequired(false))
                .addStringOption((option) => option
                .setName('image')
                .setDescription('The image to send with the stickynote')
                .setRequired(false))
                .addStringOption((option) => option
                .setName('footer')
                .setDescription('The footer of the stickynote')
                .setRequired(false))),
            category: 'Configuration',
            permissions: ['Administrator'],
        });
    }
    async execute(interaction) {
        const guild = interaction?.guild;
        const subcommand = interaction.options.getSubcommand();
        const has_channel = interaction.options.getChannel('channel') !== null ? true : false;
        const channel = has_channel
            ? this.client.channels.cache.get(interaction.options.getChannel('channel')?.id)
            : interaction.channel;
        const options = interaction.options;
        switch (subcommand) {
            case 'create':
                (async () => {
                    const embedDescription = interaction.options.getString('description');
                    const embedColor = interaction.options.getString('color');
                    if (!embedDescription) {
                        return interaction.reply({
                            embeds: [
                                ERROR_EMBED(this.client, 'Must provide at least an embed description.'),
                            ],
                            ephemeral: true,
                        });
                    }
                    else if (!embedColor) {
                        return interaction.reply({
                            embeds: [
                                ERROR_EMBED(this.client, 'Must provide a color for the sticky note.'),
                            ],
                            ephemeral: true,
                        });
                    }
                    try {
                        await channel
                            .send({
                            embeds: [STICKYNOTE_EMBED(guild, options)],
                        })
                            .then(() => {
                            interaction.reply({
                                embeds: [
                                    SUCCESS_EMBED(this.client, 'Creating sticky note...'),
                                ],
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
                })();
                break;
            case 'clone':
                (async () => {
                    if (interaction.user.id !== '499426339321937954')
                        return;
                    const messageToFetch = interaction.options.getString('id');
                    const message = (await interaction.channel?.messages.fetch(messageToFetch));
                    console.log(message.embeds);
                })();
                break;
            case 'edit':
                if (interaction.user.id !== '499426339321937954')
                    return;
                console.log('Subcommand: edit');
                break;
            default:
                throw Error('Invalid subcommand.');
        }
    }
}
exports.default = StickynoteCommand;
