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
module.exports = defaultSettings;