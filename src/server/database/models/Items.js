const mongoose = require('mongoose');

const ItemsSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
		required: true,
	},
	image_url: {
		type: String,
		required: true,
		unique: true,
	},
	req_level: {
		type: Number,
		required: true,
	},
	req_engram_points: {
		type: Number,
		required: true,
	},
	ingredient_list: [{
		ingredient_name: {
			type: String,
			required: true,
		},
		ingredient_amount: {
			type: String,
			required: true,
		},
	}],
	crafted_in: {
		type: String,
		required: true,
	},
	experience_gained: {
		type: Number,
		required: true,
	},
});

const Items = mongoose.model('items', ItemsSchema);
module.exports = Items;