"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
const ConfigSchema = new mongoose_1.Schema({
    guild_id: {
        type: String,
        required: true,
    },
    features: {
        shop_management: {
            type: Boolean,
            default: false,
        },
        member_welcome: {
            type: Boolean,
            default: false,
        },
        anti_raid: {
            type: Boolean,
            default: false,
        },
        invite_tracking: {
            type: Boolean,
            default: false,
        },
    },
    roles: {
        admin_role: {
            type: String,
            required: false,
            default: null,
        },
        dev_role: {
            type: String,
            require: false,
            default: null,
        },
        mod_role: {
            type: String,
            require: false,
            default: null,
        },
        verified_role: {
            type: String,
            require: false,
            default: null,
        },
        mute_role: {
            type: String,
            require: false,
            default: null,
        },
    },
    log_channels: [
        {
            channel_id: {
                type: String,
                required: true,
            },
            channel_name: {
                type: String,
                required: true,
            },
            log_type: {
                type: String,
                required: true,
            },
        },
    ],
    ark_shop: {
        shop_status: {
            type: String,
            required: true,
            default: 'closed',
        },
        accepted_payments: [
            {
                type: String,
                required: true,
            },
        ],
        order_channel: {
            name: {
                type: String,
                required: true,
                default: 'null',
            },
            id: {
                type: String,
                required: true,
                default: 'null',
            },
        },
        order_key: {
            emoji: {
                type: String,
                required: true,
                default: 'null',
            },
            description: {
                type: String,
                required: true,
                default: 'null',
            },
        },
        items: [
            {
                name: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                    required: true,
                },
                seller: {
                    type: String,
                    required: true,
                },
                price: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
});
const Config = (0, mongoose_1.model)('configuration', ConfigSchema);
exports.default = Config;
