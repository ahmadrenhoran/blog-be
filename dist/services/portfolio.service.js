"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePortfolio = exports.updatePortfolio = exports.createPortfolio = exports.getPortfolios = void 0;
const db_1 = require("../db");
const models_1 = require("../models");
const drizzle_orm_1 = require("drizzle-orm");
const getPortfolios = async (userId) => {
    return db_1.db.query.portfolios.findMany({
        where: (0, drizzle_orm_1.eq)(models_1.portfolios.user_id, userId),
        orderBy: [(0, drizzle_orm_1.desc)(models_1.portfolios.createdAt)],
    });
};
exports.getPortfolios = getPortfolios;
const createPortfolio = async (userId, data) => {
    const [newPortfolio] = await db_1.db
        .insert(models_1.portfolios)
        .values({
        ...data,
        user_id: userId,
    })
        .returning();
    return newPortfolio;
};
exports.createPortfolio = createPortfolio;
const updatePortfolio = async (id, userId, data) => {
    const [updatedPortfolio] = await db_1.db
        .update(models_1.portfolios)
        .set({
        ...data,
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(models_1.portfolios.id, id), (0, drizzle_orm_1.eq)(models_1.portfolios.user_id, userId)))
        .returning();
    return updatedPortfolio;
};
exports.updatePortfolio = updatePortfolio;
const deletePortfolio = async (id, userId) => {
    await db_1.db
        .delete(models_1.portfolios)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(models_1.portfolios.id, id), (0, drizzle_orm_1.eq)(models_1.portfolios.user_id, userId)));
};
exports.deletePortfolio = deletePortfolio;
