"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreatorPosts = exports.deletePostById = exports.getPosts = exports.getPostById = exports.updatePost = exports.createPost = void 0;
const utils_1 = require("../utils/utils");
const db_1 = require("../db");
const models_1 = require("../models");
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../utils/errors");
const drizzle_orm_2 = require("drizzle-orm");
const createPost = async (userId, title, content, coverImage) => {
    const excerptText = (0, utils_1.excerpt)(content);
    const [newPost] = await db_1.db
        .insert(models_1.posts)
        .values({
        user_id: userId,
        title: title,
        slug: (0, utils_1.generateSlug)(title, 120),
        coverImage: coverImage,
        content: content,
        excerpt: excerptText,
    })
        .returning();
    return newPost;
};
exports.createPost = createPost;
const updatePost = async (postId, userId, title, status, content, coverImage) => {
    const updatedRows = await db_1.db
        .update(models_1.posts)
        .set({
        title,
        content,
        status,
        coverImage,
    })
        .where((0, drizzle_orm_2.and)((0, drizzle_orm_1.eq)(models_1.posts.id, postId), (0, drizzle_orm_1.eq)(models_1.posts.user_id, userId)))
        .returning();
    if (updatedRows.length === 0) {
        throw new errors_1.AppError(`Post not found or you're not authorized to edit this post`, 403, "UNAUTHORIZED_UPDATE");
    }
    return updatedRows[0];
};
exports.updatePost = updatePost;
const getPostById = async (postId, userId) => {
    const post = await db_1.db.execute((0, drizzle_orm_1.sql) `select * from posts where id = ${postId} and user_id = ${userId} limit 1`);
    if (post.rows.length === 0) {
        throw new errors_1.AppError(`Post not found or you're not authorized to view this post`, 403, "UNAUTHORIZED_GET");
    }
    return post.rows[0];
};
exports.getPostById = getPostById;
const getPosts = async (page = 1, pageSize = 10, search) => {
    const offset = (page - 1) * pageSize;
    const filters = search
        ? (0, drizzle_orm_1.ilike)(models_1.posts.title, `%${search}%`)
        : undefined;
    const [data, countResult] = await Promise.all([
        db_1.db
            .select()
            .from(models_1.posts)
            .where(filters)
            .limit(pageSize)
            .offset(offset)
            .orderBy((0, drizzle_orm_1.desc)(models_1.posts.createdAt)),
        db_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(models_1.posts).where(filters),
    ]);
    const totalCount = countResult[0].total;
    return {
        data,
        meta: {
            currentPage: page,
            pageSize,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
        },
    };
};
exports.getPosts = getPosts;
const deletePostById = async (postId, userId) => {
    const result = await db_1.db.execute((0, drizzle_orm_1.sql) `delete from posts 
        where id = ${postId} and user_id = ${userId} 
        returning *`);
    // result.rows biasanya berisi array dari baris yang terpengaruh
    if (result.rows.length === 0) {
        throw new errors_1.AppError(`Post not found or you're not authorized to delete this post`, 403, "UNAUTHORIZED_DELETE");
    }
    return result.rows[0];
};
exports.deletePostById = deletePostById;
const getCreatorPosts = async (userId) => {
    const data = await db_1.db.execute((0, drizzle_orm_1.sql) `select * from posts where user_id = ${userId} order by created_at desc`);
    return data.rows;
};
exports.getCreatorPosts = getCreatorPosts;
