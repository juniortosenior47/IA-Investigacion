import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
console.log('Using BASE_URL =', BASE_URL);

const data = [
  { word: 'sol', translation: 'sun' },
  { word: 'luna', translation: 'moon' },
  { word: 'estrella', translation: 'star' }
];

(async () => {
  console.log('Adding words...');
  const addRes = await fetch(`${BASE_URL}/add_words`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  console.log('Add:', await addRes.json());

  const single = await fetch(`${BASE_URL}/translate?word=sol`);
  console.log('Single:', await single.json());

  const many = await fetch(`${BASE_URL}/translate_many`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(['sol','luna','estrella'])
  });
  console.log('Many:', await many.json());
})();
