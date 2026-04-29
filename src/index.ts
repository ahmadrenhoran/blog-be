import app from './app';
import { assertDbConnection } from './db';

const PORT = process.env.PORT ? Number(process.env.PORT) : 7860;
const HOST = '0.0.0.0';

const startServer = async () => {
  await assertDbConnection();

  app.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`);
    console.log('Database connected');
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
