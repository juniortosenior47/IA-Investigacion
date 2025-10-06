import fetch from "node-fetch";

const BASE_URL = "http://localhost:8000";

async function main() {
  console.log("Agregando palabras...");
  const addRes = await fetch(`${BASE_URL}/add_words`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([
      { word: "sol", translation: "sun" },
      { word: "luna", translation: "moon" },
      { word: "estrella", translation: "star" }
    ])
  });
  console.log("Add:", await addRes.json());

  const single = await fetch(`${BASE_URL}/translate?word=sol`);
  console.log("Translate single:", await single.json());

  const many = await fetch(`${BASE_URL}/translate_many`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(["sol", "luna", "estrella"])
  });
  console.log("Translate many:", await many.json());
}

main();
