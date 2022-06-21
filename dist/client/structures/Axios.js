"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosPrivate = exports.AxiosPublic = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const env_config_1 = require("../../interfaces/env_config");
exports.AxiosPublic = axios_1.default.create({
    baseURL: env_config_1.clientConfig.BASE_URL,
});
exports.AxiosPrivate = axios_1.default.create({
    baseURL: env_config_1.clientConfig.BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});
exports.AxiosPrivate.interceptors.request.use((config) => {
    if (!config.headers?.Authorization) {
        config.headers.Authorization = `Bearer ${env_config_1.clientConfig.API_KEY}`;
    }
    return config;
}, (error) => {
    Promise.reject(error);
});
exports.AxiosPrivate.interceptors.response.use((response) => response, async (error) => {
    return Promise.reject(error);
});
