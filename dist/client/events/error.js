"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
class ErrorEvent extends structures_1.Event {
    constructor(client) {
        super(client, 'error');
    }
    async run(error) {
        console.log(error);
        if (error.message.includes('uncaughtException')) {
            const errorMsg = error.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
            console.error(`Uncaught Exception: ${errorMsg}`);
            process.exit(1);
        }
        if (error.message.includes('unhandledRejection')) {
            console.error(`Unhandled rejection: ${error}`);
        }
    }
}
exports.default = ErrorEvent;
