import express from "express";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
const REDIS_PREFIX = process.env.REDIS_PREFIX || "translator:word:";

const redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT });

function key(word: string, prefix?: string) {
  return `${prefix || REDIS_PREFIX}${word}`;
}

app.get('/translate', async (req, res) => {
  const word = (req.query.word as string || '').toLowerCase();
  const prefix = (req.query.prefix as string) || undefined;
  const t = await redis.get(key(word, prefix));
  res.json({ word, translation: t || 'No encontrado' });
});

app.post('/add_words', async (req, res) => {
  const words = req.body;
  const prefix = (req.query.prefix as string) || undefined;
  const pipeline = redis.pipeline();
  for (const w of words) {
    pipeline.set(key(w.word.toLowerCase(), prefix), w.translation);
  }
  await pipeline.exec();
  res.json({ message: 'Palabras agregadas', count: words.length });
});

app.post('/translate_many', async (req, res) => {
  const words = req.body;
  const prefix = (req.query.prefix as string) || undefined;
  const keys = words.map((w: string) => key(w.toLowerCase(), prefix));
  const results = await redis.mget(...keys);
  const translations: any = {};
  words.forEach((w: string, i: number) => translations[w] = results[i] || 'No encontrado');
  res.json({ translations });
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
