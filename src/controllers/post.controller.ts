import { NextFunction, Request, Response } from "express";
import * as postService from "../services/post.service";
import { ApiResponse } from "../utils/response";
import { AuthRequest } from "../middleware/auth.middleware";

export const createPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, content, cover_image } = req.body;

    const userId = req.user.id

    const newPost = await postService.createPost(
      userId,
      title,
      content,
      cover_image,
    );

    ApiResponse.success(res, newPost, "Successfully created a new post", 200);
  } catch (error: any) {
    next(error);
  }
};

export const updatePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, cover_image } = req.body;

    const userId = req.user.id

    const newPost = await postService.updatePost(
      parseInt(id as string),
      userId,
      title,
      content,
      cover_image,
    );

    ApiResponse.success(res, newPost, "Post updated successfully", 200);
  } catch (error: any) {
    next(error);
  }
};

export const getPostById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user.id

    const newPost = await postService.getPostById(
      parseInt(id as string),
      userId,
    );

    ApiResponse.success(res, newPost, "Successfully created a new post", 200);
  } catch (error: any) {
    next(error);
  }
};

export const deletePostById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user.id

    const newPost = await postService.deletePostById(
      parseInt(id as string),
      userId,
    );

    ApiResponse.success(res, newPost, "Successfully created a new post", 200);
  } catch (error: any) {
    next(error);
  }
};

export const getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, pageSize, search } = req.params
    const posts = await postService.getPosts(parseInt(page as string), parseInt(pageSize as string), search as string)

    ApiResponse.success(res, posts, "Successfully get posts", 200);
  } catch (error) {
    next(error)
  }
}
