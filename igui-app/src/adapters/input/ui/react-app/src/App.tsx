import React, { useState } from 'react';

export default function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  const translate = async () => {
    const resp = await fetch('http://localhost:3000/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, fromLang: 'spanish', toLang: 'english' })
    });
    const data = await resp.json();
    setResult(data.translated);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Traductor Hexagonal (React + Vite)</h1>
      <textarea rows={6} cols={80} value={text} onChange={e=>setText(e.target.value)} placeholder="Escribe texto en español..." />
      <div style={{ marginTop: 10 }}>
        <button onClick={translate}>Traducir</button>
      </div>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>
    </div>
  );
}
