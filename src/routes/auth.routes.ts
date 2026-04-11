import { register, login } from '../controllers/auth.controller';
import express from 'express';

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);

export default authRoutes;