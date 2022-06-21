"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    guild_id: {
        type: String,
        required: true,
    },
    buyer: {
        name: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
    },
    seller: {
        name: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
    },
    order_status: {
        type: String,
        required: true,
    },
    purchased_items: [
        {
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    payment_method: [
        {
            type: String,
            required: true,
        },
    ],
});
const Order = (0, mongoose_1.model)('order', OrderSchema);
exports.default = Order;
