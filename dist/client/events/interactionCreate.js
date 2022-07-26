"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const structures_1 = require("../structures");
const format_1 = require("../utils/format");
const functions_1 = tslib_1.__importDefault(require("../utils/functions"));
class InteractionCreateEvent extends structures_1.Event {
    constructor(client) {
        super(client, 'interactionCreate');
    }
    async run(interaction) {
        const permissions = new structures_1.Permissions(this.client);
        if (interaction.isCommand()) {
            const command = this.client.commands.get(interaction.commandName);
            if (!command)
                return;
            const level = permissions.FromContext(interaction);
            const requiredLevel = permissions.FromName(command.info.permissions[0]);
            if (level < requiredLevel) {
                const response = (0, format_1.embed)()
                    .setColor('#ff8b8b')
                    .setDescription([
                    `${functions_1.default.FindEmoji(this.client, 'redCheckBox')} `,
                    `You do not have permission to use this command.`,
                    `Your permission level is ${level} (${permissions.list[level].name})`,
                    `This command requires a permission level of ${requiredLevel} (${command.info.permissions[0]})`,
                ].join('\n'));
                return interaction.reply({
                    embeds: [response],
                    ephemeral: true,
                });
            }
            try {
                await command.execute(interaction);
            }
            catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true,
                });
            }
        }
    }
}
exports.default = InteractionCreateEvent;
