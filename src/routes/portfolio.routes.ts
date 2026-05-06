import express from "express";
import {
  getPortfolios,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "../controllers/portfolio.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { portfolioSchema } from "../schemas/portfolio.schema";

const portfolioRoutes = express.Router();

portfolioRoutes.use(authMiddleware);

portfolioRoutes.get("/", getPortfolios);
portfolioRoutes.post("/", validate(portfolioSchema), createPortfolio);
portfolioRoutes.patch("/:id", validate(portfolioSchema), updatePortfolio);
portfolioRoutes.delete("/:id", deletePortfolio);

export default portfolioRoutes;
