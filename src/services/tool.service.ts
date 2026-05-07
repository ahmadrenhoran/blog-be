import { db } from "../db";
import { tools } from "../models";
import { ilike, or } from "drizzle-orm";

export const getTools = async (search?: string) => {
  if (search) {
    return db.query.tools.findMany({
      where: or(
        ilike(tools.name, `%${search}%`),
        ilike(tools.slug, `%${search}%`)
      ),
      limit: 20,
    });
  }
  return db.query.tools.findMany({
    limit: 50,
  });
};

export const createTool = async (data: any) => {
  const [newTool] = await db.insert(tools).values(data).returning();
  return newTool;
};
