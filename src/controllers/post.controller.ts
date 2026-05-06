import { NextFunction, Request, Response } from "express";
import * as postService from "../services/post.service";
import { ApiResponse } from "../utils/response";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError } from "../utils/errors";

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
    const { title, content, status, cover_image } = req.body;

    const userId = req.user.id

    const newPost = await postService.updatePost(
      parseInt(id as string),
      userId,
      title,
      status,
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

export const getPosts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, pageSize, search } = req.query
    const userId = req.user.id;
    const parsedPage = page ? parseInt(page as string) : undefined;
    const parsedPageSize = pageSize ? parseInt(pageSize as string) : undefined;
    const posts = await postService.getPosts(userId, parsedPage, parsedPageSize, search as string)

    ApiResponse.success(res, posts, "Successfully get posts", 200);
  } catch (error) {
    next(error)
  }
}

export const getCreatorPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    if (!Number.isInteger(Number(userId))) {
      throw new AppError("Invalid user id", 400, "INVALID_USER_ID");
    }

    const posts = await postService.getCreatorPosts(userId as string);

    ApiResponse.success(res, posts, "Successfully get creator posts", 200);
  } catch (error) {
    next(error);
  }
};

export const getCreatorPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, postId } = req.params;
    if (!Number.isInteger(Number(userId))) {
      throw new AppError("Invalid user id", 400, "INVALID_USER_ID");
    }

    if (!Number.isInteger(Number(postId))) {
      throw new AppError("Invalid post id", 400, "INVALID_POST_ID");
    }

    const post = await postService.getCreatorPostById(
      userId as string,
      parseInt(postId as string),
    );

    ApiResponse.success(res, post, "Successfully get creator post", 200);
  } catch (error) {
    next(error);
  }
};
