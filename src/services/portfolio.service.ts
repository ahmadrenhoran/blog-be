import { db } from "../db";
import { portfolios, portfolioSections, portfolioMedia, portfolioTools } from "../models";
import { eq, and, desc, inArray, notInArray } from "drizzle-orm";

export const getPortfolios = async (userId: number, filters: any = {}) => {
  const { category, is_featured, is_published, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  // Basic implementation of filtering
  // In a real app, you might want to build a more complex where clause
  return db.query.portfolios.findMany({
    where: eq(portfolios.user_id, userId),
    with: {
      media: {
        orderBy: [desc(portfolioMedia.sort_order)],
        limit: 1,
      },
      tools: {
        with: {
          tool: true,
        }
      }
    },
    orderBy: [desc(portfolios.createdAt)],
    limit,
    offset,
  });
};

export const getPortfolioById = async (id: number, userId: number) => {
  return db.query.portfolios.findFirst({
    where: and(eq(portfolios.id, id), eq(portfolios.user_id, userId)),
    with: {
      sections: {
        orderBy: [portfolioSections.sort_order],
      },
      media: {
        orderBy: [portfolioMedia.sort_order],
      },
      tools: {
        with: {
          tool: true,
        }
      }
    }
  });
};

export const createPortfolio = async (userId: number, data: any) => {
  const { sections, media, tool_ids, ...rest } = data;

  return await db.transaction(async (tx) => {
    const [newPortfolio] = await tx
      .insert(portfolios)
      .values({
        ...rest,
        user_id: userId,
      })
      .returning();

    if (sections && sections.length > 0) {
      await tx.insert(portfolioSections).values(
        sections.map((s: any) => ({ ...s, portfolio_id: newPortfolio.id }))
      );
    }

    if (media && media.length > 0) {
      await tx.insert(portfolioMedia).values(
        media.map((m: any) => ({ ...m, portfolio_id: newPortfolio.id }))
      );
    }

    if (tool_ids && tool_ids.length > 0) {
      await tx.insert(portfolioTools).values(
        tool_ids.map((toolId: number, index: number) => ({
          portfolio_id: newPortfolio.id,
          tool_id: toolId,
          sort_order: index,
        }))
      );
    }

    return newPortfolio;
  });
};

export const updatePortfolio = async (id: number, userId: number, data: any) => {
  const { sections, media, tool_ids, ...rest } = data;

  return await db.transaction(async (tx) => {
    // 1. Update main portfolio data
    const [updatedPortfolio] = await tx
      .update(portfolios)
      .set({
        ...rest,
        updatedAt: new Date(),
      })
      .where(and(eq(portfolios.id, id), eq(portfolios.user_id, userId)))
      .returning();

    if (!updatedPortfolio) throw new Error("Portfolio not found or unauthorized");

    // 2. Sync Sections
    if (sections) {
      const existingSections = await tx.query.portfolioSections.findMany({
        where: eq(portfolioSections.portfolio_id, id),
      });
      const existingIds = existingSections.map(s => s.id);
      const incomingIds = sections.filter((s: any) => s.id).map((s: any) => s.id);

      // Delete removed sections
      const toDelete = existingIds.filter(eid => !incomingIds.includes(eid));
      if (toDelete.length > 0) {
        await tx.delete(portfolioSections).where(inArray(portfolioSections.id, toDelete));
      }

      // Update existing and insert new
      for (const section of sections) {
        if (section.id) {
          await tx.update(portfolioSections).set(section).where(eq(portfolioSections.id, section.id));
        } else {
          await tx.insert(portfolioSections).values({ ...section, portfolio_id: id });
        }
      }
    }

    // 3. Sync Media
    if (media) {
      const existingMedia = await tx.query.portfolioMedia.findMany({
        where: eq(portfolioMedia.portfolio_id, id),
      });
      const existingMediaIds = existingMedia.map(m => m.id);
      const incomingMediaIds = media.filter((m: any) => m.id).map((m: any) => m.id);

      const mediaToDelete = existingMediaIds.filter(eid => !incomingMediaIds.includes(eid));
      if (mediaToDelete.length > 0) {
        await tx.delete(portfolioMedia).where(inArray(portfolioMedia.id, mediaToDelete));
      }

      for (const m of media) {
        if (m.id) {
          await tx.update(portfolioMedia).set(m).where(eq(portfolioMedia.id, m.id));
        } else {
          await tx.insert(portfolioMedia).values({ ...m, portfolio_id: id });
        }
      }
    }

    // 4. Sync Tools
    if (tool_ids) {
      await tx.delete(portfolioTools).where(eq(portfolioTools.portfolio_id, id));
      if (tool_ids.length > 0) {
        await tx.insert(portfolioTools).values(
          tool_ids.map((toolId: number, index: number) => ({
            portfolio_id: id,
            tool_id: toolId,
            sort_order: index,
          }))
        );
      }
    }

    return updatedPortfolio;
  });
};

export const duplicatePortfolio = async (id: number, userId: number) => {
  return await db.transaction(async (tx) => {
    const original = await tx.query.portfolios.findFirst({
      where: and(eq(portfolios.id, id), eq(portfolios.user_id, userId)),
      with: {
        sections: true,
        media: true,
        tools: true,
      }
    });

    if (!original) throw new Error("Portfolio not found");

    const { id: _, createdAt: __, updatedAt: ___, ...rest } = original;
    const [newPortfolio] = await tx
      .insert(portfolios)
      .values({
        ...rest,
        title: `${original.title} (Copy)`,
        slug: `${original.slug}-copy-${Date.now()}`,
        is_published: false,
      })
      .returning();

    if (original.sections.length > 0) {
      await tx.insert(portfolioSections).values(
        original.sections.map(s => {
          const { id: _, createdAt: __, ...sRest } = s;
          return { ...sRest, portfolio_id: newPortfolio.id };
        })
      );
    }

    if (original.media.length > 0) {
      await tx.insert(portfolioMedia).values(
        original.media.map(m => {
          const { id: _, createdAt: __, ...mRest } = m;
          return { ...mRest, portfolio_id: newPortfolio.id };
        })
      );
    }

    if (original.tools.length > 0) {
      await tx.insert(portfolioTools).values(
        original.tools.map(t => ({
          portfolio_id: newPortfolio.id,
          tool_id: t.tool_id,
          sort_order: t.sort_order,
        }))
      );
    }

    return newPortfolio;
  });
};

export const deletePortfolio = async (id: number, userId: number) => {
  await db
    .delete(portfolios)
    .where(and(eq(portfolios.id, id), eq(portfolios.user_id, userId)));
};
