"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemsRoute = exports.dossierRoute = exports.configRoute = void 0;
var settings_1 = require("./api/settings");
Object.defineProperty(exports, "configRoute", { enumerable: true, get: function () { return __importDefault(settings_1).default; } });
var dossier_1 = require("./api/dossier");
Object.defineProperty(exports, "dossierRoute", { enumerable: true, get: function () { return __importDefault(dossier_1).default; } });
var items_1 = require("./api/items");
Object.defineProperty(exports, "itemsRoute", { enumerable: true, get: function () { return __importDefault(items_1).default; } });
