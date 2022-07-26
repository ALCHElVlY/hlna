"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandHandlerError = {
    _FAILEDTOLOAD: (param1 = []) => {
        console.log(`❌ There was an error loading ${param1.length} files from the commands directory`, 'error');
    },
};
exports.default = CommandHandlerError;
