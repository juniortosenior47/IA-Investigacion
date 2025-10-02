import React, { useState } from "react";

const languages = ["en", "es", "fr", "de"];

export default function App() {
  const [from, setFrom] = useState("en");
  const [to, setTo] = useState("es");
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");

  const handleTranslate = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, from, to })
      });
      const data = await res.json();
      setTranslated(data.translated);
    } catch (err) {
      console.error("Error translating:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🌍 Translator</h1>
      <div style={{ display: "flex", gap: "1rem" }}>
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang}>{lang}</option>
          ))}
        </select>
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang}>{lang}</option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <textarea
          rows={4}
          cols={40}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe el texto aquí..."
        />
      </div>
      <button style={{ marginTop: "1rem" }} onClick={handleTranslate}>
        Traducir
      </button>
      <div style={{ marginTop: "1rem" }}>
        <textarea rows={4} cols={40} value={translated} readOnly />
      </div>
    </div>
  );
}

