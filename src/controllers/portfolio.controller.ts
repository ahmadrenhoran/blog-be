import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as portfolioService from "../services/portfolio.service";
import { ApiResponse } from "../utils/response";

export const getPortfolios = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const filters = req.query;
    const data = await portfolioService.getPortfolios(userId, filters);
    ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

export const getPortfolioById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const id = req.params.id as string;
    const data = await portfolioService.getPortfolioById(parseInt(id), userId);
    if (!data) {
      return ApiResponse.error(res, null, "Portfolio not found", 404);
    }
    ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

export const createPortfolio = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const data = await portfolioService.createPortfolio(userId, req.body);
    ApiResponse.success(res, data, "Portfolio created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updatePortfolio = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const id = req.params.id as string;
    const data = await portfolioService.updatePortfolio(parseInt(id), userId, req.body);
    ApiResponse.success(res, data, "Portfolio updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deletePortfolio = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const id = req.params.id as string;
    await portfolioService.deletePortfolio(parseInt(id), userId);
    ApiResponse.success(res, null, "Portfolio deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const duplicatePortfolio = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const id = req.params.id as string;
    const data = await portfolioService.duplicatePortfolio(parseInt(id), userId);
    ApiResponse.success(res, data, "Portfolio duplicated successfully");
  } catch (error) {
    next(error);
  }
};
