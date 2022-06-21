"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemData = void 0;
const tslib_1 = require("tslib");
const Item_1 = tslib_1.__importDefault(require("../database/models/Item"));
const getItemData = async (req, res) => {
    try {
        const { name } = req.params;
        Item_1.default.findOne({ name })
            .then((data) => res.json(data))
            .catch((e) => console.error(e));
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getItemData = getItemData;
