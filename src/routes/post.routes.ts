import express from 'express';
import { createPost, deletePostById, getPostById, getPosts, updatePost } from '../controllers/post.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const postRoutes = express.Router();

postRoutes.post('/', authMiddleware, createPost);
postRoutes.put('/:id', authMiddleware, updatePost);
postRoutes.get('/:id', authMiddleware, getPostById);
postRoutes.get('/', authMiddleware, getPosts);
postRoutes.delete('/:id', authMiddleware, deletePostById);

export default postRoutes;
