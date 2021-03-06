"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const configController_1 = require("../../middleware/configController");
const router = express_1.default.Router();
router.post('/', configController_1.createConfiguration);
router.delete('/', configController_1.deleteConfiguration);
router.get('/', configController_1.getConfiguration);
router.put('/:guild_id', configController_1.updateConfiguration);
exports.default = router;
