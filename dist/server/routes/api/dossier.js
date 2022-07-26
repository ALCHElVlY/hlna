"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const dossierController_1 = require("../../middleware/dossierController");
const router = express_1.default.Router();
router.get('/:creature_name', dossierController_1.getDossier);
exports.default = router;
