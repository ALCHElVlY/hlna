"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const env_config_1 = require("../../interfaces/env_config");
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization || undefined;
    try {
        if (!authHeader)
            throw Error('Missing authorization header!');
        const decodedToken = jsonwebtoken_1.default.sign({ 'auth-token': authHeader }, env_config_1.serverConfig.API_KEY);
        jsonwebtoken_1.default.verify(decodedToken, env_config_1.serverConfig.API_KEY, (err, decoded) => {
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
exports.default = protect;
