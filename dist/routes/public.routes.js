"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const public_controller_1 = require("../controllers/public.controller");
const publicRoutes = express_1.default.Router();
publicRoutes.get("/:username/portfolio", public_controller_1.getPublicPortfolios);
publicRoutes.get("/:username/cv", public_controller_1.getPublicResume);
publicRoutes.get("/:username/blog", public_controller_1.getPublicBlogs);
publicRoutes.get("/:username/blog/:slug", public_controller_1.getPublicBlogDetail);
exports.default = publicRoutes;
