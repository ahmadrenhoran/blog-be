import express from 'express';
import authRoutes from './auth.routes';
import postRoutes from './post.routes';
import uploadRoutes from './upload.routes';
import aiWritingRoutes from './ai-writing.routes';

const router = express.Router();

router.use('/upload', uploadRoutes);
router.use('/auth', authRoutes);
router.use('/post', postRoutes);
router.use('/ai', aiWritingRoutes);

export default router;
