import app from './app';

const PORT = Number(process.env.PORT) || 7860;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
