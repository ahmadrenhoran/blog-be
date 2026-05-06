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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicBlogDetail = exports.getPublicBlogs = exports.getPublicResume = exports.getPublicPortfolios = void 0;
const publicService = __importStar(require("../services/public.service"));
const response_1 = require("../utils/response");
const getPublicPortfolios = async (req, res, next) => {
    try {
        const username = req.params.username;
        const lang = req.query.lang || "en";
        const data = await publicService.getPublicPortfolios(username, lang);
        response_1.ApiResponse.success(res, data);
    }
    catch (error) {
        next(error);
    }
};
exports.getPublicPortfolios = getPublicPortfolios;
const getPublicResume = async (req, res, next) => {
    try {
        const username = req.params.username;
        const data = await publicService.getPublicResume(username);
        response_1.ApiResponse.success(res, data);
    }
    catch (error) {
        next(error);
    }
};
exports.getPublicResume = getPublicResume;
const getPublicBlogs = async (req, res, next) => {
    try {
        const username = req.params.username;
        const data = await publicService.getPublicBlogs(username);
        response_1.ApiResponse.success(res, data);
    }
    catch (error) {
        next(error);
    }
};
exports.getPublicBlogs = getPublicBlogs;
const getPublicBlogDetail = async (req, res, next) => {
    try {
        const username = req.params.username;
        const slug = req.params.slug;
        const data = await publicService.getPublicBlogDetail(username, slug);
        response_1.ApiResponse.success(res, data);
    }
    catch (error) {
        next(error);
    }
};
exports.getPublicBlogDetail = getPublicBlogDetail;
