"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ItemSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    image_url: {
        type: String,
        required: true,
        unique: true,
    },
    req_level: {
        type: Number,
        required: true,
    },
    req_engram_points: {
        type: Number,
        required: true,
    },
    ingredient_list: {
        type: String,
        required: true,
    },
    crafted_in: {
        type: String,
        required: true,
    },
    experience_gained: {
        type: Number,
        required: true,
    },
});
const Item = (0, mongoose_1.model)('item', ItemSchema);
exports.default = Item;
