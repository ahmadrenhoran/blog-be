import { excerpt, generateSlug } from "../utils/utils";
import { db } from "../db";
import { posts } from "../models";
import { count, desc, eq, ilike, sql } from "drizzle-orm";
import { AppError } from "../utils/errors";
import { and } from "drizzle-orm";

export const createPost = async (
  userId: number,
  title: string,
  content: string,
  coverImage: string,
) => {
  const excerptText = excerpt(content);

  const [newPost] = await db
    .insert(posts)
    .values({
      user_id: userId,
      title: title,
      slug: generateSlug(title, 120),
      coverImage: coverImage,
      content: content,
      excerpt: excerptText,
    })
    .returning();

  return newPost;
};
export const updatePost = async (
  postId: number,
  userId: number,
  title: string,
  status: "draft" | "published",
  content: string,
  coverImage: string,
) => {
  const updatedRows = await db
    .update(posts)
    .set({
      title,
      content,
      status,
      coverImage,
    })
    .where(and(eq(posts.id, postId), eq(posts.user_id, userId)))
    .returning();

  if (updatedRows.length === 0) {
    throw new AppError(
      `Post not found or you're not authorized to edit this post`,
      403,
      "UNAUTHORIZED_UPDATE",
    );
  }

  return updatedRows[0];
};

export const getPostById = async (postId: number, userId: string) => {
  const post = await db.execute(
    sql`select * from posts where id = ${postId} and user_id = ${userId} limit 1`,
  );

  if (post.rows.length === 0) {
    throw new AppError(
      `Post not found or you're not authorized to view this post`,
      403,
      "UNAUTHORIZED_GET",
    );
  }
  return post.rows[0];
};

export const getPosts = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string,
) => {
  const offset = (page - 1) * pageSize;

  const filters = search
    ? ilike(posts.title, `%${search}%`)
    : undefined;

  const [data, countResult] = await Promise.all([
    db
      .select()
      .from(posts)
      .where(filters)
      .limit(pageSize)
      .offset(offset)
      .orderBy(desc(posts.createdAt)),

    db.select({ total: count() }).from(posts).where(filters),
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

export const deletePostById = async (postId: number, userId: string) => {
  const result = await db.execute(
    sql`delete from posts 
        where id = ${postId} and user_id = ${userId} 
        returning *`, // Menambahkan returning agar data yang dihapus bisa dicek
  );

  // result.rows biasanya berisi array dari baris yang terpengaruh
  if (result.rows.length === 0) {
    throw new AppError(
      `Post not found or you're not authorized to delete this post`,
      403,
      "UNAUTHORIZED_DELETE",
    );
  }
  return result.rows[0];
};

export const getCreatorPosts = async (userId: string) => {
  return db
    .select()
    .from(posts)
    .where(and(eq(posts.user_id, Number(userId)), eq(posts.status, "published")))
    .orderBy(desc(posts.createdAt));
};

export const getCreatorPostById = async (userId: string, postId: number) => {
  const [post] = await db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.id, postId),
        eq(posts.user_id, Number(userId)),
        eq(posts.status, "published"),
      ),
    )
    .limit(1);

  if (!post) {
    throw new AppError("Post not found", 404, "POST_NOT_FOUND");
  }

  return post;
};
