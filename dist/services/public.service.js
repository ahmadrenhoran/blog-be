"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicBlogDetail = exports.getPublicBlogs = exports.getPublicResume = exports.getPublicPortfolios = void 0;
const db_1 = require("../db");
const models_1 = require("../models");
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../utils/errors");
const getUserByUsername = async (username) => {
    const user = await db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(models_1.users.username, username),
    });
    if (!user) {
        throw new errors_1.AppError("User not found", 404);
    }
    return user;
};
const getPublicPortfolios = async (username, lang = "en") => {
    const user = await getUserByUsername(username);
    const data = await db_1.db.query.portfolios.findMany({
        where: (0, drizzle_orm_1.eq)(models_1.portfolios.user_id, user.id),
        orderBy: [(0, drizzle_orm_1.desc)(models_1.portfolios.createdAt)],
    });
    return data.map((p) => {
        const description = p.description;
        return {
            ...p,
            description: description ? description[lang] || description["en"] || description["id"] || null : null,
        };
    });
};
exports.getPublicPortfolios = getPublicPortfolios;
const getPublicResume = async (username) => {
    const user = await getUserByUsername(username);
    const data = await db_1.db.query.resumes.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(models_1.resumes.user_id, user.id), (0, drizzle_orm_1.eq)(models_1.resumes.is_primary, true)),
    }) || await db_1.db.query.resumes.findFirst({
        where: (0, drizzle_orm_1.eq)(models_1.resumes.user_id, user.id),
        orderBy: [(0, drizzle_orm_1.desc)(models_1.resumes.uploaded_at)],
    });
    return data;
};
exports.getPublicResume = getPublicResume;
const getPublicBlogs = async (username) => {
    const user = await getUserByUsername(username);
    return db_1.db.query.posts.findMany({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(models_1.posts.user_id, user.id), (0, drizzle_orm_1.eq)(models_1.posts.status, "published")),
        orderBy: [(0, drizzle_orm_1.desc)(models_1.posts.createdAt)],
    });
};
exports.getPublicBlogs = getPublicBlogs;
const getPublicBlogDetail = async (username, slug) => {
    const user = await getUserByUsername(username);
    const data = await db_1.db.query.posts.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(models_1.posts.user_id, user.id), (0, drizzle_orm_1.eq)(models_1.posts.slug, slug), (0, drizzle_orm_1.eq)(models_1.posts.status, "published")),
    });
    if (!data) {
        throw new errors_1.AppError("Blog post not found", 404);
    }
    return data;
};
exports.getPublicBlogDetail = getPublicBlogDetail;
