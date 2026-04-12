import { register, login } from '../controllers/auth.controller';
import express from 'express';
import { validate } from '../middleware/validate.middleware';
import { registerSchema } from '../schemas/auth.schema';

const authRoutes = express.Router();

authRoutes.post('/register', validate(registerSchema), register);
authRoutes.post('/login', login);

export default authRoutes;