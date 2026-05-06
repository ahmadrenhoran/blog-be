import { Request, Response, NextFunction } from "express";
import * as publicService from "../services/public.service";
import { ApiResponse } from "../utils/response";

export const getPublicPortfolios = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.params.username as string;
    const lang = (req.query.lang as string) || "en";
    const data = await publicService.getPublicPortfolios(username, lang);
    ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

export const getPublicResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.params.username as string;
    const data = await publicService.getPublicResume(username);
    ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

export const getPublicBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.params.username as string;
    const data = await publicService.getPublicBlogs(username);
    ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

export const getPublicBlogDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.params.username as string;
    const slug = req.params.slug as string;
    const data = await publicService.getPublicBlogDetail(username, slug);
    ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};
