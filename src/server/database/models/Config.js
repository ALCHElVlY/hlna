const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
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
	log_channels: [{
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
	}],
	ark_shop: {
		shop_status: {
			type: String,
			required: true,
			default: 'closed',
		},
		accepted_payments: [{
			type: String,
			required: true,
		}],
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
		items: [{
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
		}],
	},
});

const Config = mongoose.model('configuration', ConfigSchema);
module.exports = Config;

/*
mutes: {
		case_id: {
			type: Number,
			required: true,
			unique: true,
			spare: true,
		},
		user: {
			user_id: {
				type: String,
				required: true,
				unique: true,
			},
			username: {
				type: String,
				required: true,
				unique: true,
			},
		},
		reason: {
			type: String,
			required: true,
		},
*/