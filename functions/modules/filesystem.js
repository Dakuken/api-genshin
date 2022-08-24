"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = exports.getAvailableImages = exports.getEntity = exports.getAvailableEntities = exports.getTypes = void 0;
/*
 * Copyright (c) 2020 genshin.dev
 * Licensed under the Open Software License version 3.0
 */
const config_1 = require("../config");
const keyv_1 = __importDefault(require("keyv"));
const fs_1 = require("fs");
const mime_types_1 = __importDefault(require("mime-types"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const chalk_1 = __importDefault(require("chalk"));
const cache = new keyv_1.default();
async function getTypes() {
    const found = await cache.get('types');
    if (found)
        return found;
    const types = await fs_1.promises.readdir((0, config_1.dataDirectory)(''));
    await cache.set('types', types);
    console.log('added types to cache');
    return types;
}
exports.getTypes = getTypes;
async function getAvailableEntities(type) {
    const found = await cache.get(`data-${type}`.toLowerCase());
    if (found)
        return found;
    const exists = (0, fs_1.existsSync)((0, config_1.dataDirectory)(type));
    if (!exists)
        throw new Error(`Type ${type} not found`);
    const entities = await fs_1.promises.readdir((0, config_1.dataDirectory)(type));
    await cache.set(`data-${type}`, entities);
    console.log(chalk_1.default.blue('[Cache-Data]'), chalk_1.default.green(`(${type})`), 'Added to the cache');
    return entities;
}
exports.getAvailableEntities = getAvailableEntities;
async function getEntity(type, id, lang = 'en') {
    const cacheId = `data-${type}-${id}-${lang}`.toLowerCase();
    const found = await cache.get(cacheId);
    if (found)
        return found;
    const filePath = path_1.default
        .join((0, config_1.dataDirectory)(type), id.toLowerCase(), `${lang}.json`)
        .normalize();
    const exists = (0, fs_1.existsSync)(filePath);
    if (!exists) {
        let errorMessage = `Entity ${type}/${id} for language ${lang} not found`;
        const englishPath = path_1.default
            .join((0, config_1.dataDirectory)(type), id.toLowerCase(), 'en.json')
            .normalize();
        const englishExists = (0, fs_1.existsSync)(englishPath);
        if (englishExists)
            errorMessage += `, language en would exist`;
        throw new Error(errorMessage);
    }
    const file = await fs_1.promises.readFile(filePath);
    try {
        const entity = JSON.parse(file.toString('utf-8'));
        await cache.set(cacheId, entity);
        console.log(chalk_1.default.blue('[Cache-Data]'), chalk_1.default.green(`(${type})`), 'Added', chalk_1.default.yellow(id), 'in', chalk_1.default.magenta(`${lang}`), 'to the cache');
        return entity;
    }
    catch (e) {
        throw new Error(`Error in JSON formatting of Entity ${type}/${id} for language ${lang}, create an issue at https://github.com/genshindev/api/issues`);
    }
}
exports.getEntity = getEntity;
async function getAvailableImages(type, id) {
    const cacheId = `image-${type}-${id}`.toLowerCase();
    const found = await cache.get(cacheId);
    if (found)
        return found;
    const filePath = path_1.default.join((0, config_1.imagesDirectory)(type), id).normalize();
    if (!(0, fs_1.existsSync)(filePath)) {
        throw new Error(`No images for ${type}/${id} exist`);
    }
    const images = await fs_1.promises.readdir(filePath);
    await cache.set(cacheId, images);
    console.log(chalk_1.default.blue('[Cache-Image]'), chalk_1.default.green(`(${type})`), 'Added', chalk_1.default.yellow(id), 'to the cache');
    return images;
}
exports.getAvailableImages = getAvailableImages;
async function getImage(type, id, image) {
    const parsedPath = path_1.default.parse(image);
    const filePath = path_1.default
        .join((0, config_1.imagesDirectory)(type), id, parsedPath.name)
        .normalize();
    const requestedFileType = parsedPath.ext.length > 0 ? parsedPath.ext.substring(1) : 'webp';
    if (!(0, fs_1.existsSync)(filePath)) {
        throw new Error(`Image ${type}/${id}/${image} doesn't exist ${type}---------${id} ------------${image}`);
    }
    return {
        image: await (0, sharp_1.default)(filePath).toFormat(requestedFileType).toBuffer(),
        type: mime_types_1.default.lookup(requestedFileType) || 'text/plain',
    };
}
exports.getImage = getImage;
