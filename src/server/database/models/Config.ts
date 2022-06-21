// External imports
import { Document, Schema, model as Model } from 'mongoose';

// Define the document interface
export interface IConfig extends Document {
  guild_id: string;
  features: object;
  roles: object;
  log_channels: object[];
  ark_shop: object;
};

// Define the schema for the config model
const ConfigSchema = new Schema({
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

// Export the model
const Config = Model<IConfig>('configuration', ConfigSchema);
export default Config;
