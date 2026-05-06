import { db } from "../db";
import { resumes } from "../models";
import { eq, and, desc } from "drizzle-orm";

export const getResumes = async (userId: number) => {
  return db.query.resumes.findMany({
    where: eq(resumes.user_id, userId),
    orderBy: [desc(resumes.uploaded_at)],
  });
};

export const uploadResume = async (userId: number, data: { file_url: string; file_name: string; is_primary?: boolean }) => {
  const { file_url, file_name, is_primary } = data;

  if (is_primary) {
    // Set others to not primary
    await db
      .update(resumes)
      .set({ is_primary: false })
      .where(eq(resumes.user_id, userId));
  }

  const [newResume] = await db
    .insert(resumes)
    .values({
      user_id: userId,
      file_url,
      file_name,
      is_primary: is_primary || false,
    })
    .returning();
  
  return newResume;
};

export const deleteResume = async (id: number, userId: number) => {
  await db
    .delete(resumes)
    .where(and(eq(resumes.id, id), eq(resumes.user_id, userId)));
};

export const setPrimaryResume = async (id: number, userId: number) => {
  // Set others to not primary
  await db
    .update(resumes)
    .set({ is_primary: false })
    .where(eq(resumes.user_id, userId));

  const [updatedResume] = await db
    .update(resumes)
    .set({ is_primary: true })
    .where(and(eq(resumes.id, id), eq(resumes.user_id, userId)))
    .returning();
  
  return updatedResume;
};
