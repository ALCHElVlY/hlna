"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDossier = void 0;
const tslib_1 = require("tslib");
const Dossier_1 = tslib_1.__importDefault(require("../database/models/Dossier"));
const getDossier = async (req, res) => {
    try {
        const { creature_name } = req.params;
        Dossier_1.default.findOne({ creature_name })
            .then((data) => res.json(data))
            .catch((e) => console.error(e));
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getDossier = getDossier;
