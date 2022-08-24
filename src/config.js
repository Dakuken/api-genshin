"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imagesDirectory = exports.dataDirectory = void 0;
/*
 * Copyright (c) 2020 genshin.dev
 * Licensed under the Open Software License version 3.0
 */
const path_1 = __importDefault(require("path"));
const dataDirectory = (type) => path_1.default.join(__dirname, '../assets/data', type);
exports.dataDirectory = dataDirectory;
const imagesDirectory = (type) => path_1.default.join(__dirname, '../assets/images', type);
exports.imagesDirectory = imagesDirectory;
