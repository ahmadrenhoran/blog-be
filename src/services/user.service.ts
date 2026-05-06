import { db } from "../db";
import { users } from "../models";
import { eq } from "drizzle-orm";
import { AppError } from "../utils/errors";

export const updateProfile = async (
  userId: number,
  data: { username?: string; name?: string }
) => {
  const { username, name } = data;

  // Slugify username if provided
  let sanitizedUsername = username;
  if (username) {
    sanitizedUsername = username
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Check if username is already taken by another user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, sanitizedUsername),
    });

    if (existingUser && existingUser.id !== userId) {
      throw new AppError("Username already taken", 400);
    }
  }

  const [updatedUser] = await db
    .update(users)
    .set({
      username: sanitizedUsername,
      name,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return updatedUser;
};
