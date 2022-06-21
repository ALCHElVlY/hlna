"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const express_rate_limit_1 = require("express-rate-limit");
const db_1 = tslib_1.__importDefault(require("./database/config/db"));
const env_config_1 = require("../interfaces/env_config");
const protect_js_1 = tslib_1.__importDefault(require("../server/middleware/protect.js"));
const routes_1 = require("./routes/");
const app = (0, express_1.default)();
const PORT = env_config_1.serverConfig.PORT | 5000;
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 1 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    message: 'Too many requests have been made, please try again later.',
});
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(limiter);
app.use('/api/settings', protect_js_1.default, routes_1.configRoute);
app.use('/api/dossiers', protect_js_1.default, routes_1.dossierRoute);
app.use('/api/items', protect_js_1.default, routes_1.itemsRoute);
(async () => {
    await (0, db_1.default)();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
