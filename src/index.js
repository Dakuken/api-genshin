"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2020 genshin.dev
 * Licensed under the Open Software License version 3.0
 */
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const cors_1 = __importDefault(require("@koa/cors"));
const Sentry = __importStar(require("@sentry/node"));
const chalk_1 = __importDefault(require("chalk"));
const routes_1 = __importDefault(require("./routes"));
const sentryDsn = process.env.SENTRY_DSN;
// Check if Sentry
if (sentryDsn && sentryDsn.length > 0) {
    console.log(chalk_1.default.blue('[Sentry]'), 'Enabled Sentry error logging');
    Sentry.init({
        dsn: sentryDsn,
        tracesSampleRate: 0.5,
    });
}
(async () => {
    const app = new koa_1.default();
    const port = process.env.PORT || 5000;
    app.use((0, koa_body_1.default)());
    app.use((0, koa_helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use(routes_1.default.routes());
    app.listen(port, () => {
        console.log(chalk_1.default.blue('[API]'), 'Running on', chalk_1.default.yellow(`0.0.0.0:${port}`));
    });
})();
