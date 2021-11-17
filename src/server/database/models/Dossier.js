const mongoose = require('mongoose');

const DossierSchema = new mongoose.Schema({
	creature_name: {
		type: String,
		required: true,
		unique: true,
	},
	base_cost: {
		type: Number,
		required: true,
	},
	per_level_cost: {
		type: Number,
		required: true,
	},
});

const Dossier = mongoose.model('dossier', DossierSchema);
module.exports = Dossier;