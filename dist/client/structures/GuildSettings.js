"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Axios_1 = require("./Axios");
const enums_1 = require("../../enums");
const functions_1 = tslib_1.__importDefault(require("../utils/functions"));
const defaultSettings = {
    features: {
        shop_management: false,
        member_welcome: false,
        anti_raid: false,
        invite_tracking: false,
    },
    roles: {
        admin_role: null,
        dev_role: null,
        mod_role: null,
        verified_role: null,
        mute_role: null,
    },
    ark_shop: {
        order_channel: {
            name: null,
            id: null,
        },
        order_key: {
            emoji: null,
            description: null,
        },
        shop_status: 'closed',
        accepted_payments: [],
        items: [],
    },
    log_channels: [],
};
class GuildSettings {
    client;
    defaults;
    constructor(client) {
        this.client = client;
        this.defaults = this.setDefaults(defaultSettings);
    }
    set setDefaults(defaults) {
        this.defaults = defaults;
    }
    get getDefaults() {
        return this.defaults;
    }
    async Edit(interaction) {
        interaction.reply({
            content: 'Which setting would you like to edit?',
        });
        const filter = (m) => {
            if (m.author.id === interaction.user.id)
                return true;
            return false;
        };
        try {
            const response = await interaction.channel?.awaitMessages({
                filter,
                max: 1,
                time: 30000,
                errors: ['time'],
            });
            if (response) {
                const { content } = response.first();
                switch (content) {
                    case 'roles':
                        await enums_1.GuildSettingsEnum.Roles(this.client, interaction, response);
                        break;
                    case 'log channels':
                        await enums_1.GuildSettingsEnum.Logs(this.client, interaction, response);
                        break;
                    default:
                        throw Error('That setting either does not exist or is not editable.');
                }
            }
        }
        catch (e) {
            await interaction.reply({
                embeds: [enums_1.EmbedEnum.ERROR_EMBED(this.client, e.message)],
                ephemeral: true,
            });
        }
    }
    async Restore(interaction) {
        const { guild } = interaction;
        const response = await functions_1.default.AwaitConfirmation(interaction, 'Are you sure you want to restore the guild settings to their default values?');
        if (response) {
            await Axios_1.AxiosPrivate.put(`${process.env.CONFIGURATION}/${guild?.id}`, {
                key: 'restore_settings',
                value: this.defaults,
            });
            this.client.settings.set(guild?.id, this.getDefaults);
            interaction.channel?.send({
                embeds: [
                    enums_1.EmbedEnum.SUCCESS_EMBED(this.client, 'Guild settings have been restored to their default values.'),
                ],
            });
        }
    }
}
exports.default = GuildSettings;
