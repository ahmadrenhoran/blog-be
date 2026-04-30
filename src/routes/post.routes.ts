import express from 'express';
import {
  createPost,
  deletePostById,
  getCreatorPostById,
  getCreatorPosts,
  getPostById,
  getPosts,
  updatePost,
} from '../controllers/post.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const postRoutes = express.Router();

postRoutes.get('/creator/:userId/:postId', getCreatorPostById);
postRoutes.get('/creator/:userId', getCreatorPosts);
postRoutes.post('/', authMiddleware, createPost);
postRoutes.put('/:id', authMiddleware, updatePost);
postRoutes.get('/:id', authMiddleware, getPostById);
postRoutes.get('/', authMiddleware, getPosts);
postRoutes.delete('/:id', authMiddleware, deletePostById);

export default postRoutes;
