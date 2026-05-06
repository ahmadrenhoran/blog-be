"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPrimaryResume = exports.deleteResume = exports.uploadResume = exports.getResumes = void 0;
const db_1 = require("../db");
const models_1 = require("../models");
const drizzle_orm_1 = require("drizzle-orm");
const getResumes = async (userId) => {
    return db_1.db.query.resumes.findMany({
        where: (0, drizzle_orm_1.eq)(models_1.resumes.user_id, userId),
        orderBy: [(0, drizzle_orm_1.desc)(models_1.resumes.uploaded_at)],
    });
};
exports.getResumes = getResumes;
const uploadResume = async (userId, data) => {
    const { file_url, file_name, is_primary } = data;
    if (is_primary) {
        // Set others to not primary
        await db_1.db
            .update(models_1.resumes)
            .set({ is_primary: false })
            .where((0, drizzle_orm_1.eq)(models_1.resumes.user_id, userId));
    }
    const [newResume] = await db_1.db
        .insert(models_1.resumes)
        .values({
        user_id: userId,
        file_url,
        file_name,
        is_primary: is_primary || false,
    })
        .returning();
    return newResume;
};
exports.uploadResume = uploadResume;
const deleteResume = async (id, userId) => {
    await db_1.db
        .delete(models_1.resumes)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(models_1.resumes.id, id), (0, drizzle_orm_1.eq)(models_1.resumes.user_id, userId)));
};
exports.deleteResume = deleteResume;
const setPrimaryResume = async (id, userId) => {
    // Set others to not primary
    await db_1.db
        .update(models_1.resumes)
        .set({ is_primary: false })
        .where((0, drizzle_orm_1.eq)(models_1.resumes.user_id, userId));
    const [updatedResume] = await db_1.db
        .update(models_1.resumes)
        .set({ is_primary: true })
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(models_1.resumes.id, id), (0, drizzle_orm_1.eq)(models_1.resumes.user_id, userId)))
        .returning();
    return updatedResume;
};
exports.setPrimaryResume = setPrimaryResume;
