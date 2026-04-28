import express from 'express';
import authRoutes from './auth.routes';
import postRoutes from './post.routes';
import uploadRoutes from './upload.routes';

const router = express.Router();

router.use('/upload', uploadRoutes);
router.use('/auth', authRoutes);
router.use('/post', postRoutes);

export default router;
