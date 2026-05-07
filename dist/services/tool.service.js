"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTool = exports.getTools = void 0;
const db_1 = require("../db");
const models_1 = require("../models");
const drizzle_orm_1 = require("drizzle-orm");
const getTools = async (search) => {
    if (search) {
        return db_1.db.query.tools.findMany({
            where: (0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(models_1.tools.name, `%${search}%`), (0, drizzle_orm_1.ilike)(models_1.tools.slug, `%${search}%`)),
            limit: 20,
        });
    }
    return db_1.db.query.tools.findMany({
        limit: 50,
    });
};
exports.getTools = getTools;
const createTool = async (data) => {
    const [newTool] = await db_1.db.insert(models_1.tools).values(data).returning();
    return newTool;
};
exports.createTool = createTool;
