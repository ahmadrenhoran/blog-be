"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePortfolio = exports.duplicatePortfolio = exports.updatePortfolio = exports.createPortfolio = exports.getPortfolioById = exports.getPortfolios = void 0;
const db_1 = require("../db");
const models_1 = require("../models");
const drizzle_orm_1 = require("drizzle-orm");
const getPortfolios = async (userId, filters = {}) => {
    const { category, is_featured, is_published, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;
    // Basic implementation of filtering
    // In a real app, you might want to build a more complex where clause
    return db_1.db.query.portfolios.findMany({
        where: (0, drizzle_orm_1.eq)(models_1.portfolios.user_id, userId),
        with: {
            media: {
                orderBy: [(0, drizzle_orm_1.desc)(models_1.portfolioMedia.sort_order)],
                limit: 1,
            },
            tools: {
                with: {
                    tool: true,
                }
            }
        },
        orderBy: [(0, drizzle_orm_1.desc)(models_1.portfolios.createdAt)],
        limit,
        offset,
    });
};
exports.getPortfolios = getPortfolios;
const getPortfolioById = async (id, userId) => {
    return db_1.db.query.portfolios.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(models_1.portfolios.id, id), (0, drizzle_orm_1.eq)(models_1.portfolios.user_id, userId)),
        with: {
            sections: {
                orderBy: [models_1.portfolioSections.sort_order],
            },
            media: {
                orderBy: [models_1.portfolioMedia.sort_order],
            },
            tools: {
                with: {
                    tool: true,
                }
            }
        }
    });
};
exports.getPortfolioById = getPortfolioById;
const createPortfolio = async (userId, data) => {
    const { sections, media, tool_ids, ...rest } = data;
    return await db_1.db.transaction(async (tx) => {
        const [newPortfolio] = await tx
            .insert(models_1.portfolios)
            .values({
            ...rest,
            user_id: userId,
        })
            .returning();
        if (sections && sections.length > 0) {
            await tx.insert(models_1.portfolioSections).values(sections.map((s) => ({ ...s, portfolio_id: newPortfolio.id })));
        }
        if (media && media.length > 0) {
            await tx.insert(models_1.portfolioMedia).values(media.map((m) => ({ ...m, portfolio_id: newPortfolio.id })));
        }
        if (tool_ids && tool_ids.length > 0) {
            await tx.insert(models_1.portfolioTools).values(tool_ids.map((toolId, index) => ({
                portfolio_id: newPortfolio.id,
                tool_id: toolId,
                sort_order: index,
            })));
        }
        return newPortfolio;
    });
};
exports.createPortfolio = createPortfolio;
const updatePortfolio = async (id, userId, data) => {
    const { sections, media, tool_ids, ...rest } = data;
    return await db_1.db.transaction(async (tx) => {
        // 1. Update main portfolio data
        const [updatedPortfolio] = await tx
            .update(models_1.portfolios)
            .set({
            ...rest,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(models_1.portfolios.id, id), (0, drizzle_orm_1.eq)(models_1.portfolios.user_id, userId)))
            .returning();
        if (!updatedPortfolio)
            throw new Error("Portfolio not found or unauthorized");
        // 2. Sync Sections
        if (sections) {
            const existingSections = await tx.query.portfolioSections.findMany({
                where: (0, drizzle_orm_1.eq)(models_1.portfolioSections.portfolio_id, id),
            });
            const existingIds = existingSections.map(s => s.id);
            const incomingIds = sections.filter((s) => s.id).map((s) => s.id);
            // Delete removed sections
            const toDelete = existingIds.filter(eid => !incomingIds.includes(eid));
            if (toDelete.length > 0) {
                await tx.delete(models_1.portfolioSections).where((0, drizzle_orm_1.inArray)(models_1.portfolioSections.id, toDelete));
            }
            // Update existing and insert new
            for (const section of sections) {
                if (section.id) {
                    await tx.update(models_1.portfolioSections).set(section).where((0, drizzle_orm_1.eq)(models_1.portfolioSections.id, section.id));
                }
                else {
                    await tx.insert(models_1.portfolioSections).values({ ...section, portfolio_id: id });
                }
            }
        }
        // 3. Sync Media
        if (media) {
            const existingMedia = await tx.query.portfolioMedia.findMany({
                where: (0, drizzle_orm_1.eq)(models_1.portfolioMedia.portfolio_id, id),
            });
            const existingMediaIds = existingMedia.map(m => m.id);
            const incomingMediaIds = media.filter((m) => m.id).map((m) => m.id);
            const mediaToDelete = existingMediaIds.filter(eid => !incomingMediaIds.includes(eid));
            if (mediaToDelete.length > 0) {
                await tx.delete(models_1.portfolioMedia).where((0, drizzle_orm_1.inArray)(models_1.portfolioMedia.id, mediaToDelete));
            }
            for (const m of media) {
                if (m.id) {
                    await tx.update(models_1.portfolioMedia).set(m).where((0, drizzle_orm_1.eq)(models_1.portfolioMedia.id, m.id));
                }
                else {
                    await tx.insert(models_1.portfolioMedia).values({ ...m, portfolio_id: id });
                }
            }
        }
        // 4. Sync Tools
        if (tool_ids) {
            await tx.delete(models_1.portfolioTools).where((0, drizzle_orm_1.eq)(models_1.portfolioTools.portfolio_id, id));
            if (tool_ids.length > 0) {
                await tx.insert(models_1.portfolioTools).values(tool_ids.map((toolId, index) => ({
                    portfolio_id: id,
                    tool_id: toolId,
                    sort_order: index,
                })));
            }
        }
        return updatedPortfolio;
    });
};
exports.updatePortfolio = updatePortfolio;
const duplicatePortfolio = async (id, userId) => {
    return await db_1.db.transaction(async (tx) => {
        const original = await tx.query.portfolios.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(models_1.portfolios.id, id), (0, drizzle_orm_1.eq)(models_1.portfolios.user_id, userId)),
            with: {
                sections: true,
                media: true,
                tools: true,
            }
        });
        if (!original)
            throw new Error("Portfolio not found");
        const { id: _, createdAt: __, updatedAt: ___, ...rest } = original;
        const [newPortfolio] = await tx
            .insert(models_1.portfolios)
            .values({
            ...rest,
            title: `${original.title} (Copy)`,
            slug: `${original.slug}-copy-${Date.now()}`,
            is_published: false,
        })
            .returning();
        if (original.sections.length > 0) {
            await tx.insert(models_1.portfolioSections).values(original.sections.map(s => {
                const { id: _, createdAt: __, ...sRest } = s;
                return { ...sRest, portfolio_id: newPortfolio.id };
            }));
        }
        if (original.media.length > 0) {
            await tx.insert(models_1.portfolioMedia).values(original.media.map(m => {
                const { id: _, createdAt: __, ...mRest } = m;
                return { ...mRest, portfolio_id: newPortfolio.id };
            }));
        }
        if (original.tools.length > 0) {
            await tx.insert(models_1.portfolioTools).values(original.tools.map(t => ({
                portfolio_id: newPortfolio.id,
                tool_id: t.tool_id,
                sort_order: t.sort_order,
            })));
        }
        return newPortfolio;
    });
};
exports.duplicatePortfolio = duplicatePortfolio;
const deletePortfolio = async (id, userId) => {
    await db_1.db
        .delete(models_1.portfolios)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(models_1.portfolios.id, id), (0, drizzle_orm_1.eq)(models_1.portfolios.user_id, userId)));
};
exports.deletePortfolio = deletePortfolio;
