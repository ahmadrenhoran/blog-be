import express from "express";
import {
  getPublicPortfolios,
  getPublicResume,
  getPublicBlogs,
  getPublicBlogDetail,
} from "../controllers/public.controller";

const publicRoutes = express.Router();

publicRoutes.get("/:username/portfolio", getPublicPortfolios);
publicRoutes.get("/:username/cv", getPublicResume);
publicRoutes.get("/:username/blog", getPublicBlogs);
publicRoutes.get("/:username/blog/:slug", getPublicBlogDetail);

export default publicRoutes;
