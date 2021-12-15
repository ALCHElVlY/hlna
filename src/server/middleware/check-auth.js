const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
	// Check the auth header for the token
	const authHeader = req.headers.authorization || undefined;

	try {
		// Handle if no authorization header is present
		// (i.e. no token was provided)
		if (!authHeader) throw Error('Missing authorization header!');

		const decodedToken = jwt.sign({ 'auth-token': authHeader }, process.env.API_KEY);
		jwt.verify(decodedToken, process.env.API_KEY, (err, decoded) => {
			const token = decoded['auth-token'].split(' ')[1];
			if (token === process.env.API_KEY) {
				next();
			}
			else {
				throw Error('Not authorized');
			}
		});
	}
	catch (e) {
		res.status(401).send({
			message: e.message,
		});
	}
};

module.exports = checkAuth;