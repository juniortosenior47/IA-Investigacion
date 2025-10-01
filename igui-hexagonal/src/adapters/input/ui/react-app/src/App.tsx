import React, { useState } from "react";
import { Container } from "../../../../config/container";

export default function App() {
  const [text, setText] = useState(""); 
  const [result, setResult] = useState(""); 

  const handle = async () => {
    const svc = Container.getTranslateService();
    const words = text.trim().split(/\s+/);
    const res = await svc.translateArray(words, 'spanish', 'english');
    setResult(res.join(' '));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Traductor Hexagonal (React)</h1>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={4} cols={50} placeholder="Escribe texto en español..." />
      <div style={{ marginTop: 10 }}>
        <button onClick={handle}>Traducir</button>
      </div>
      <p style={{ whiteSpace: 'pre-wrap' }}>{result}</p>
    </div>
  );
}
