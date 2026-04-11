import { title } from "node:process";
import { excerpt, generateSlug } from '../utils/utils';
import { db } from "../db";
import { posts } from "../models";

export const createPost = async (title: String, content: String, coverImage: String) => {
    const excerptText = excerpt(content)


    const [newPost] = await db.insert(posts).values({
        title: title,
        slug: generateSlug(title, 120)

    }).returning()
}