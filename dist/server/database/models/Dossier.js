"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
const DossierSchema = new mongoose_1.Schema({
    creature_name: {
        type: String,
        required: true,
        unique: true,
    },
    base_cost: {
        type: Number,
        required: true,
    },
    per_level_cost: {
        type: Number,
        required: true,
    },
});
const Dossier = (0, mongoose_1.model)('dossier', DossierSchema);
exports.default = Dossier;
