"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2020 genshin.dev
 * Licensed under the Open Software License version 3.0
 */
const koa_router_1 = __importDefault(require("koa-router"));
const filesystem_1 = require("../modules/filesystem");
const router = new koa_router_1.default();
router.get('/', async (ctx) => {
    const types = await (0, filesystem_1.getTypes)();
    ctx.body = {
        types,
    };
});
router.get('/:type', async (ctx) => {
    const { type } = ctx.params;
    try {
        const entityNames = await (0, filesystem_1.getAvailableEntities)(type);
        ctx.body = entityNames;
    }
    catch (e) {
        ctx.status = 404;
        const availableTypes = await (0, filesystem_1.getTypes)();
        ctx.body = {
            error: e.message,
            availableTypes,
        };
    }
});
router.get('/:type/all', async (ctx) => {
    try {
        const { lang, ...params } = ctx.query;
        const { type } = ctx.params;
        const entities = await (0, filesystem_1.getAvailableEntities)(type);
        if (!entities)
            return;
        const entityObjects = await Promise.all(entities.map(async (id) => {
            try {
                return await (0, filesystem_1.getEntity)(type, id, lang);
            }
            catch (e) {
                return null;
            }
        }));
        ctx.body = entityObjects.filter((entity) => {
            if (!entity)
                return;
            for (const key of Object.keys(params)) {
                const value = entity[key];
                switch (typeof value) {
                    case 'string':
                        if (!value.includes(params[key]))
                            return false;
                        break;
                    default:
                        if (value != params[key])
                            return false;
                        break;
                }
            }
            return true;
        });
    }
    catch (e) {
        ctx.status = 404;
        ctx.body = { error: e.message };
    }
});
router.get('/:type/:id', async (ctx) => {
    try {
        const { lang } = ctx.query;
        const { type, id } = ctx.params;
        ctx.body = await (0, filesystem_1.getEntity)(type, id, lang);
    }
    catch (e) {
        ctx.status = 404;
        ctx.body = { error: e.message };
    }
});
router.get('/:type/:id/list', async (ctx) => {
    const { type, id } = ctx.params;
    try {
        ctx.body = await (0, filesystem_1.getAvailableImages)(type, id);
    }
    catch (e) {
        ctx.status = 404;
        ctx.body = { error: e.message };
    }
});
router.get('/:type/:id/:imageType', async (ctx) => {
    const { type, id, imageType } = ctx.params;
    try {
        const image = await (0, filesystem_1.getImage)(type, id, imageType);
        ctx.body = image.image;
        ctx.type = image.type;
    }
    catch (e) {
        ctx.status = 404;
        try {
            const av = await (0, filesystem_1.getAvailableImages)(type, id);
            ctx.body = { error: e.message, availableImages: av };
        }
        catch (e) {
            ctx.body = { error: e.message };
        }
    }
});
exports.default = router;
