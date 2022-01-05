/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const format = require('../../utility/format');
const client = require('../../index');

// Import the embed builders
const {
	STICKYNOTE_EMBED,
	ERROR_EMBED,
} = require('../../utility/embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stickynote')
		.setDescription('Creates, clone, or edit an existing sticky note.')
		.addSubcommand(command =>
			command.setName('create')
				.setDescription('Creates a sticky note from scratch.')
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('The channel to send the embed to.')
						.setRequired(false))
				.addStringOption(option =>
					option.setName('color')
						.setDescription('The color of the sticky note. Must be a hex color code.')
						.setRequired(false))
				.addStringOption(option =>
					option.setName('title')
						.setDescription('The title of the sticky note.')
						.setRequired(false))
				.addStringOption(option =>
					option.setName('description')
						.setDescription('The body of the stickynote.')
						.setRequired(false))
				.addStringOption(option =>
					option.setName('image')
						.setDescription('The image to send with the stickynote.')
						.setRequired(false))
				.addStringOption(option =>
					option.setName('footer')
						.setDescription('The footer of the stickynote.')
						.setRequired(false)))
		.addSubcommand(command =>
			command.setName('clone')
				.setDescription('Clone and resend an existing stickynote.')
				.addStringOption(option =>
					option.setName('id')
						.setDescription('The message ID of the stickynote to clone.')
						.setRequired(true)))
		.addSubcommand(command =>
			command.setName('edit')
				.setDescription('Edit an existing stickynote.')
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('The channel to send the embed to.')
						.setRequired(false))
				.addStringOption(option =>
					option.setName('color')
						.setDescription('The color of the sticky note. Must be a hex color code.')
						.setRequired(false))
				.addStringOption(option =>
					option.setName('title')
						.setDescription('The title of the sticky note.')
						.setRequired(false))
				.addStringOption(option =>
					option.setName('description')
						.setDescription('The body of the stickynote.')
						.setRequired(false))
				.addStringOption(option =>
					option.setName('image')
						.setDescription('The image to send with the stickynote.')
						.setRequired(false))
				.addStringOption(option =>
					option.setName('footer')
						.setDescription('The footer of the stickynote.')
						.setRequired(false)))
		.setDefaultPermission(true),
	category: 'Configuration',
	permissions: ['Administrator'],
	async execute(interaction) {
		if (interaction.user.id !== '499426339321937954') return;
		const subcommand = interaction.options._subcommand;
		const channel = interaction.options._hoistedOptions.channel;
		const options = interaction.options._hoistedOptions;
		try {
			switch (subcommand) {
			case 'create':
				console.log('Subcommand: create');
				STICKYNOTE_EMBED(options);
				break;
			case 'clone':
				console.log('Subcommand: clone');
				STICKYNOTE_EMBED(options);
				break;
			case 'edit':
				console.log('Subcommand: edit');
				STICKYNOTE_EMBED(options);
				break;
			default:
				throw Error('Invalid subcommand.');
			}
		}
		catch (e) {
			console.log(e);
		}
	},
};