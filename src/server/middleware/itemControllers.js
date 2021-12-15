// Import the item model
const Items = require('../database/models/Items');

const getItemData = async (req, res) => {
	try {
		const { name } = req.params;
		Items.findOne({ name })
			.then(data => res.json(data))
			.catch(e => console.error(e));
	}
	catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server Error' });
	}
};

module.exports = {
	getItemData,
};