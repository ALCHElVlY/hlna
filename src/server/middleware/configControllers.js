/* eslint-disable no-unused-vars */
// Import the database model
const Config = require('../database/models/Config');

const createConfiguration = async (req, res) => {
	try {
		const { guild_id } = req.body;
		Config.insertMany({ guild_id })
			.then((guild) => res.json(guild))
			.catch((e) => console.error(e));
	}
	catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server Error' });
	}
};

const deleteConfiguration = async (req, res) => {
	try {
		const { guild_id } = req.body;
		Config.deleteOne(guild_id)
			.then(() => res.json({ success: true }))
			.catch(e => res.status(404).json({ success: false }));
	}
	catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server Error' });
	}
};

const getConfiguration = async (req, res) => {
	try {
		Config.find({})
			.then(data => res.json(data))
			.catch(e => console.error(e));
	}
	catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server Error' });
	}
};

const updateConfiguration = async (req, res) => {
	try {
		const { guild_id } = req.params;
		const data = req.body;
		const key = data.key;
		switch (key) {
		case 'prefix':
			Config.findOne({ guild_id })
				.updateOne({}, { $set: { prefix: data.value } })
				.then(() => res.json({ success: true }))
				.catch(e => res.status(404).json({ success: false }));
			break;
		case 'roles.admin_role':
			Config.findOne({ guild_id })
				.updateOne({}, { $set: { 'roles.admin_role': data.value } })
				.then(() => res.json({ success: true }))
				.catch(e => res.status(404).json({ success: false }));
			break;
		case 'roles.dev_role':
			Config.findOne({ guild_id })
				.updateOne({}, { $set: { 'roles.dev_role': data.value } })
				.then(() => res.json({ success: true }))
				.catch(e => res.status(404).json({ success: false }));
			break;
		case 'roles.mod_role':
			Config.findOne({ guild_id })
				.updateOne({}, { $set: { 'roles.mod_role': data.value } })
				.then(() => res.json({ success: true }))
				.catch(e => res.status(404).json({ success: false }));
			break;
		case 'roles.verified_role':
			Config.findOne({ guild_id })
				.updateOne({}, { $set: { 'roles.verified_role': data.value } })
				.then(() => res.json({ success: true }))
				.catch(e => res.status(404).json({ success: false }));
			break;
		case 'roles.mute_role':
			Config.findOne({ guild_id })
				.updateOne({}, { $set: { 'roles.mute_role': data.value } })
				.then(() => res.json({ success: true }))
				.catch(e => res.status(404).json({ success: false }));
			break;
		}
	}
	catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server Error' });
	}
};

module.exports = {
	createConfiguration,
	deleteConfiguration,
	getConfiguration,
	updateConfiguration,
};