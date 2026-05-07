"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const portfolio_controller_1 = require("../controllers/portfolio.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const portfolio_schema_1 = require("../schemas/portfolio.schema");
const portfolioRoutes = express_1.default.Router();
portfolioRoutes.use(auth_middleware_1.authMiddleware);
portfolioRoutes.get("/", portfolio_controller_1.getPortfolios);
portfolioRoutes.get("/:id", portfolio_controller_1.getPortfolioById);
portfolioRoutes.post("/", (0, validate_middleware_1.validate)(portfolio_schema_1.portfolioSchema), portfolio_controller_1.createPortfolio);
portfolioRoutes.patch("/:id", (0, validate_middleware_1.validate)(portfolio_schema_1.portfolioSchema), portfolio_controller_1.updatePortfolio);
portfolioRoutes.post("/:id/duplicate", portfolio_controller_1.duplicatePortfolio);
portfolioRoutes.delete("/:id", portfolio_controller_1.deletePortfolio);
exports.default = portfolioRoutes;
