"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const env_config_1 = require("../../../interfaces/env_config");
const MONGO_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
async function connectDatabase() {
    try {
        mongoose_1.default.connect(env_config_1.serverConfig.MONGO_URI, MONGO_OPTIONS);
        console.log('MongoDB connection sucessful!');
    }
    catch (error) {
        console.error('MongoDB connection failed.');
        process.exit(1);
    }
}
exports.default = connectDatabase;
