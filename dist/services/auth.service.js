"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const user_model_1 = require("../models/user.model");
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../utils/errors");
const JWT_SECRET = process.env.JWT_SECRET;
const registerUser = async (name, email, passwordRaw, username) => {
    // Sanitize username
    const sanitizedUsername = username
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    const existingEmail = await db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(user_model_1.users.email, email),
    });
    if (existingEmail)
        throw new errors_1.AppError("Email has registered!", 400, "USER_IS_EXISTED");
    const existingUser = await db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(user_model_1.users.username, sanitizedUsername),
    });
    if (existingUser)
        throw new errors_1.AppError("Username already taken!", 400, "USERNAME_TAKEN");
    const hashedPassword = await bcrypt_1.default.hash(passwordRaw, 10);
    const [newUser] = await db_1.db
        .insert(user_model_1.users)
        .values({
        name,
        email,
        username: sanitizedUsername,
        password: hashedPassword,
    })
        .returning({ id: user_model_1.users.id, name: user_model_1.users.name, email: user_model_1.users.email, username: user_model_1.users.username });
    return newUser;
};
exports.registerUser = registerUser;
const loginUser = async (email, passwordRaw) => {
    const user = await db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(user_model_1.users.email, email),
    });
    if (!user)
        throw new errors_1.AppError("Email or password is invalid!", 400, "INVALID_CREDENTIALS");
    const isMatch = await bcrypt_1.default.compare(passwordRaw, user.password);
    if (!isMatch)
        throw new errors_1.AppError("Email or password is invalid!", 400, "INVALID_CREDENTIALS");
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1d",
    });
    return {
        user: { id: user.id, name: user.name, email: user.email, username: user.username },
        token
    };
};
exports.loginUser = loginUser;
