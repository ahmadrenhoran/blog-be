"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = void 0;
const db_1 = require("../db");
const models_1 = require("../models");
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../utils/errors");
const updateProfile = async (userId, data) => {
    const { username, name } = data;
    // Slugify username if provided
    let sanitizedUsername = username;
    if (username) {
        sanitizedUsername = username
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
        // Check if username is already taken by another user
        const existingUser = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(models_1.users.username, sanitizedUsername),
        });
        if (existingUser && existingUser.id !== userId) {
            throw new errors_1.AppError("Username already taken", 400);
        }
    }
    const [updatedUser] = await db_1.db
        .update(models_1.users)
        .set({
        username: sanitizedUsername,
        name,
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.eq)(models_1.users.id, userId))
        .returning();
    return updatedUser;
};
exports.updateProfile = updateProfile;
