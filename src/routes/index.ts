import express from 'express';
import authRoutes from './auth.routes';
import postRoutes from './post.routes';
import uploadRoutes from './upload.routes';
import aiWritingRoutes from './ai-writing.routes';
import userRoutes from './user.routes';
import portfolioRoutes from './portfolio.routes';
import resumeRoutes from './resume.routes';
import publicRoutes from './public.routes';

const router = express.Router();

router.use('/upload', uploadRoutes);
router.use('/auth', authRoutes);
router.use('/post', postRoutes);
router.use('/ai', aiWritingRoutes);
router.use('/user', userRoutes);
router.use('/portfolios', portfolioRoutes);
router.use('/resumes', resumeRoutes);
router.use('/public', publicRoutes);

export default router;
