const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
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
	ingredient_list: {
		type: String,
		required: true,
	},
	crafted_in: {
		type: String,
		required: true,
	},
	experience_gained: {
		type: Number,
		required: true,
	},
});

const Item = mongoose.model('item', ItemSchema);
module.exports = Item;