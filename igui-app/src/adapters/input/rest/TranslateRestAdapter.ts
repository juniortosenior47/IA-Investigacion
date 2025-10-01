import express from 'express';
import bodyParser from 'body-parser';
import { Container } from '../../../config/container';

const app = express();
app.use(bodyParser.json());

const svc = Container.getTranslateService();

app.post('/translate', async (req, res) => {
  const { text, fromLang = 'spanish', toLang = 'english' } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });

  const words = typeof text === 'string' ? text.split(/\s+/) : [];
  const translated = await svc.translateArray(words, fromLang, toLang);
  res.json({ translated: translated.join(' ') });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Translate REST API listening on ${PORT}`));
