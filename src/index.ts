import app from './app';

const PORT = process.env.PORT ? Number(process.env.PORT) : 7860;
const HOST = '0.0.0.0';

app.listen(7860, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
  console.log("TOKEN:", process.env.HF_ACCESS_TOKEN);
  console.log("REPO:", process.env.HF_REVIEW);
});