import express from "express";
import {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  duplicatePortfolio,
  deletePortfolio,
} from "../controllers/portfolio.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { portfolioSchema } from "../schemas/portfolio.schema";

const portfolioRoutes = express.Router();

portfolioRoutes.use(authMiddleware);

portfolioRoutes.get("/", getPortfolios);
portfolioRoutes.get("/:id", getPortfolioById);
portfolioRoutes.post("/", validate(portfolioSchema), createPortfolio);
portfolioRoutes.patch("/:id", validate(portfolioSchema), updatePortfolio);
portfolioRoutes.post("/:id/duplicate", duplicatePortfolio);
portfolioRoutes.delete("/:id", deletePortfolio);

export default portfolioRoutes;
