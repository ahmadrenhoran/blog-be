import { db } from "../db";
import { users, portfolios, resumes, posts } from "../models";
import { eq, and, desc } from "drizzle-orm";
import { AppError } from "../utils/errors";

const getUserByUsername = async (username: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const getPublicPortfolios = async (username: string, lang: string = "en") => {
  const user = await getUserByUsername(username);

  const data = await db.query.portfolios.findMany({
    where: eq(portfolios.user_id, user.id),
    orderBy: [desc(portfolios.createdAt)],
  });

  return data.map((p) => {
    const description = p.description as any;
    return {
      ...p,
      description: description ? description[lang] || description["en"] || description["id"] || null : null,
    };
  });
};

export const getPublicResume = async (username: string) => {
  const user = await getUserByUsername(username);

  const data = await db.query.resumes.findFirst({
    where: and(eq(resumes.user_id, user.id), eq(resumes.is_primary, true)),
  }) || await db.query.resumes.findFirst({
    where: eq(resumes.user_id, user.id),
    orderBy: [desc(resumes.uploaded_at)],
  });

  return data;
};

export const getPublicBlogs = async (username: string) => {
  const user = await getUserByUsername(username);

  return db.query.posts.findMany({
    where: and(eq(posts.user_id, user.id), eq(posts.status, "published")),
    orderBy: [desc(posts.createdAt)],
  });
};

export const getPublicBlogDetail = async (username: string, slug: string) => {
  const user = await getUserByUsername(username);

  const data = await db.query.posts.findFirst({
    where: and(
      eq(posts.user_id, user.id),
      eq(posts.slug, slug),
      eq(posts.status, "published")
    ),
  });

  if (!data) {
    throw new AppError("Blog post not found", 404);
  }

  return data;
};
