import express from "express";
import { redis } from "./cache";

const app = express();
const PORT = 3000;

app.get("/translate", async (req, res) => {
  const word = (req.query.word as string)?.toLowerCase().trim();
  if (!word) return res.status(400).json({ error: "Falta el parámetro 'word'" });

  const translation = await redis.get(word);
  res.json({ input: word, translation: translation || "No encontrado" });
});

app.post("/translate_many", async (req, res) => {
  const words: string[] = req.body;
  if (!Array.isArray(words)) {
    return res.status(400).json({ error: "Se requiere una lista de palabras" });
  }

  const translations: Record<string, string> = {};
  for (const word of words) {
    const normalized = word.toLowerCase().trim();
    const translation = await redis.get(normalized);
    translations[normalized] = translation || "No encontrado";
  }

  res.json({ translations });
});


app.post("/add_word", async (req, res) => {
  const { word, translation } = req.body;
  if (!word || !translation) {
    return res.status(400).json({ error: "Se requiere 'word' y 'translation'" });
  }

  const normalized = word.toLowerCase().trim();
  await redis.set(normalized, translation);

  res.json({ message: `Palabra '${normalized}' agregada con traducción '${translation}'` });
});

app.post("/add_words", async (req, res) => {
  const words = req.body;
  if (!Array.isArray(words)) {
    return res.status(400).json({ error: "Se requiere una lista de {word, translation}" });
  }

  const added: Record<string, string>[] = [];
  for (const entry of words) {
    if (!entry.word || !entry.translation) continue;
    const normalized = entry.word.toLowerCase().trim();
    await redis.set(normalized, entry.translation);
    added.push({ [normalized]: entry.translation });
  }

  res.json({ message: "Palabras agregadas", data: added });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
