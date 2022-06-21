"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const promises_1 = require("node:fs/promises");
const path = tslib_1.__importStar(require("path"));
const loadCommand_1 = tslib_1.__importDefault(require("../utils/loadCommand"));
async function loadCommands(client, dir) {
    try {
        const files = await (0, promises_1.readdir)(dir);
        files.forEach(async (file) => {
            const filePath = path.join(dir, file);
            const stats = await (0, promises_1.stat)(filePath);
            if (stats.isDirectory()) {
                loadCommands(client, filePath);
            }
            if (stats.isFile() && file.endsWith('.ts')) {
                (0, loadCommand_1.default)(client, filePath);
            }
        });
    }
    catch (e) {
        console.log(e);
    }
}
exports.default = loadCommands;
