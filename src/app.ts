import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import v1Routes from './routes/index';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Blog API is running',
  });
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
  });
});

app.use('/api/v1', v1Routes);
app.use(errorHandler);

export default app;
