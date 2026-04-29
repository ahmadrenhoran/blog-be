"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("../controllers/post.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const postRoutes = express_1.default.Router();
postRoutes.post('/', auth_middleware_1.authMiddleware, post_controller_1.createPost);
postRoutes.put('/:id', auth_middleware_1.authMiddleware, post_controller_1.updatePost);
postRoutes.get('/:id', auth_middleware_1.authMiddleware, post_controller_1.getPostById);
postRoutes.get('/', auth_middleware_1.authMiddleware, post_controller_1.getPosts);
postRoutes.delete('/:id', auth_middleware_1.authMiddleware, post_controller_1.deletePostById);
exports.default = postRoutes;
