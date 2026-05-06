"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const user_schema_1 = require("../schemas/user.schema");
const userRoutes = express_1.default.Router();
userRoutes.patch("/profile", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validate)(user_schema_1.updateProfileSchema), user_controller_1.updateProfile);
exports.default = userRoutes;
