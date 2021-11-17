const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
	guild_id: {
		type: String,
		required: true,
	},
	prefix: {
		type: String,
		require: true,
		default: '.h',
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
			unique: true,
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