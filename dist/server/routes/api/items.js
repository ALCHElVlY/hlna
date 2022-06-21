"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const itemController_1 = require("../../middleware/itemController");
const router = express_1.default.Router();
router.get('/:name', itemController_1.getItemData);
exports.default = router;
