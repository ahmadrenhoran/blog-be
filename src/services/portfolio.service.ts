import { db } from "../db";
import { portfolios } from "../models";
import { eq, and, desc } from "drizzle-orm";

export const getPortfolios = async (userId: number) => {
  return db.query.portfolios.findMany({
    where: eq(portfolios.user_id, userId),
    orderBy: [desc(portfolios.createdAt)],
  });
};

export const createPortfolio = async (userId: number, data: any) => {
  const [newPortfolio] = await db
    .insert(portfolios)
    .values({
      ...data,
      user_id: userId,
    })
    .returning();
  return newPortfolio;
};

export const updatePortfolio = async (id: number, userId: number, data: any) => {
  const [updatedPortfolio] = await db
    .update(portfolios)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(portfolios.id, id), eq(portfolios.user_id, userId)))
    .returning();
  return updatedPortfolio;
};

export const deletePortfolio = async (id: number, userId: number) => {
  await db
    .delete(portfolios)
    .where(and(eq(portfolios.id, id), eq(portfolios.user_id, userId)));
};
