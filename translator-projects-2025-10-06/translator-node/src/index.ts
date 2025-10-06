import express from "express";
import { redis } from "./cache";

const app = express();
const PORT = Number(process.env.PORT || 3000);
const PREFIX = process.env.REDIS_PREFIX || "translator:word:";

app.use(express.json());

function key(word: string, prefix?: string) {
  const p = prefix ?? PREFIX;
  return `${p}${word}`;
}

app.get("/translate", async (req, res) => {
  const word = (req.query.word as string)?.toLowerCase().trim();
  const prefix = (req.query.prefix as string) || undefined;
  if (!word) return res.status(400).json({ error: "Falta el parámetro 'word'" });
  try {
    const t = await redis.get(key(word, prefix));
    res.json({ input: word, translation: t || "No encontrado" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post("/add_words", async (req, res) => {
  const words = req.body;
  const prefix = (req.query.prefix as string) || undefined;
  if (!Array.isArray(words) || words.length === 0) {
    return res.status(400).json({ error: "Se requiere una lista no vacía de objetos {word, translation}" });
  }
  try {
    const pipeline = redis.pipeline();
    const added: Record<string, string>[] = [];
    for (const entry of words) {
      const w = entry.word;
      const t = entry.translation;
      if (!w || t == null) continue;
      const normalized = String(w).toLowerCase().trim();
      pipeline.set(key(normalized, prefix), t);
      added.push({ [normalized]: t });
    }
    await pipeline.exec();
    res.json({ message: "Palabras agregadas", data: added });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post("/translate_many", async (req, res) => {
  const words = req.body;
  const prefix = (req.query.prefix as string) || undefined;
  if (!Array.isArray(words) || words.length === 0) {
    return res.status(400).json({ error: "Se requiere una lista no vacía de palabras" });
  }
  try {
    const normalized = words.map((w: string) => String(w).toLowerCase().trim());
    const keys = normalized.map((w: string) => key(w, prefix));
    const translations = await redis.mget(...keys);
    const result: Record<string, string> = {};
    normalized.forEach((w, i) => {
      result[w] = translations[i] || "No encontrado";
    });
    res.json({ translations: result });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
