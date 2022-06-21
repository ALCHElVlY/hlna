"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfiguration = exports.getConfiguration = exports.deleteConfiguration = exports.createConfiguration = void 0;
const tslib_1 = require("tslib");
const Config_1 = tslib_1.__importDefault(require("../database/models/Config"));
const createConfiguration = async (req, res) => {
    try {
        const { guild_id } = req.body;
        Config_1.default.insertMany({ guild_id })
            .then((guild) => res.json(guild))
            .catch((e) => console.error(e));
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.createConfiguration = createConfiguration;
const deleteConfiguration = async (req, res) => {
    try {
        const { guild_id } = req.body;
        Config_1.default.deleteOne({ guild_id })
            .then(() => res.json({ success: true }))
            .catch((e) => res.status(404).json({ success: false }));
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.deleteConfiguration = deleteConfiguration;
const getConfiguration = async (req, res) => {
    try {
        Config_1.default.find({})
            .then((data) => res.json(data))
            .catch((e) => console.error(e));
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getConfiguration = getConfiguration;
const updateConfiguration = async (req, res) => {
    try {
        const { guild_id } = req.params;
        const data = req.body;
        const key = data.key;
        switch (key) {
            case 'restore_settings':
                Config_1.default.findOne({ guild_id })
                    .updateOne({}, { $set: data.value })
                    .then(() => res.json({ success: true }))
                    .catch((e) => res.status(404).json({ success: false }));
                break;
            case 'roles.admin_role':
                Config_1.default.findOne({ guild_id })
                    .updateOne({}, { $set: { 'roles.admin_role': data.value } })
                    .then(() => res.json({ success: true }))
                    .catch((e) => res.status(404).json({ success: false }));
                break;
            case 'roles.dev_role':
                Config_1.default.findOne({ guild_id })
                    .updateOne({}, { $set: { 'roles.dev_role': data.value } })
                    .then(() => res.json({ success: true }))
                    .catch((e) => res.status(404).json({ success: false }));
                break;
            case 'roles.mod_role':
                Config_1.default.findOne({ guild_id })
                    .updateOne({}, { $set: { 'roles.mod_role': data.value } })
                    .then(() => res.json({ success: true }))
                    .catch((e) => res.status(404).json({ success: false }));
                break;
            case 'roles.verified_role':
                Config_1.default.findOne({ guild_id })
                    .updateOne({}, { $set: { 'roles.verified_role': data.value } })
                    .then(() => res.json({ success: true }))
                    .catch((e) => res.status(404).json({ success: false }));
                break;
            case 'roles.mute_role':
                Config_1.default.findOne({ guild_id })
                    .updateOne({}, { $set: { 'roles.mute_role': data.value } })
                    .then(() => res.json({ success: true }))
                    .catch((e) => res.status(404).json({ success: false }));
                break;
            case 'log_channels_add':
                Config_1.default.findOne({ guild_id })
                    .updateOne({}, { $push: { log_channels: data.value } })
                    .then(() => res.json({ success: true }))
                    .catch((e) => res.status(404).json({ success: false }));
                break;
            case 'log_channels_remove':
                Config_1.default.findOne({ guild_id })
                    .updateOne({}, { $pull: { log_channels: data.value } })
                    .then(() => res.json({ success: true }))
                    .catch((e) => res.status(404).json({ success: false }));
                break;
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.updateConfiguration = updateConfiguration;
