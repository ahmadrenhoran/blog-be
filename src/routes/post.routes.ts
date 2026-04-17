import express from 'express';
import { createPost, getPostById, updatePost } from '../controllers/post.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const postRoutes = express.Router();

postRoutes.post('/create', authMiddleware, createPost);
postRoutes.put('/:id', authMiddleware, updatePost);
postRoutes.get('/:id', authMiddleware, getPostById);

export default postRoutes;