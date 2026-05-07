import { db } from "../db";
import { users, portfolios, resumes, posts, portfolioSections, portfolioMedia } from "../models";
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
    where: and(
      eq(portfolios.user_id, user.id),
      eq(portfolios.is_published, true)
    ),
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
  });

  return data.map((p) => {
    const shortDesc = p.short_description as any;
    return {
      ...p,
      short_description: shortDesc ? shortDesc[lang] || shortDesc["en"] || shortDesc["id"] || null : null,
    };
  });
};

export const getPublicPortfolioDetail = async (username: string, slug: string, lang: string = "en") => {
  const user = await getUserByUsername(username);

  const data = await db.query.portfolios.findFirst({
    where: and(
      eq(portfolios.user_id, user.id),
      eq(portfolios.slug, slug),
      eq(portfolios.is_published, true)
    ),
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

  if (!data) {
    throw new AppError("Portfolio not found", 404);
  }

  const shortDesc = data.short_description as any;
  return {
    ...data,
    short_description: shortDesc ? shortDesc[lang] || shortDesc["en"] || shortDesc["id"] || null : null,
  };
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
