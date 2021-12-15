const crypto = require('crypto');

const generateAuthToken = () => {
	const token = crypto.randomBytes(24).toString('hex');
	try {
		console.log(token);
	}
	catch (e) {
		console.log(e);
	}
};

module.exports = generateAuthToken;