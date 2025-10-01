import React, { useState } from "react";
import { TranslateWord } from "../../../core/application/TranslateWord";
import { FakeTranslatorAdapter } from "../../../infrastructure/FakeTranslatorAdapter";
import { ApiTranslatorAdapter } from "../../../infrastructure/ApiTranslatorAdapter";

export default function App() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState("");
  const [useApi, setUseApi] = useState(false);

  const handleTranslate = async () => {
    const translator = useApi ? new ApiTranslatorAdapter() : new FakeTranslatorAdapter();
    const useCase = new TranslateWord(translator);
    setResult(await useCase.execute(word, "es", "en"));
  };

  return (
    <div>
      <h1>React Traductor</h1>
      <input
        value={word}
        onChange={e => setWord(e.target.value)}
        placeholder="Escribe una palabra..."
      />
      <label>
        <input
          type="checkbox"
          checked={useApi}
          onChange={() => setUseApi(!useApi)}
        />
        Usar API real
      </label>
      <button onClick={handleTranslate}>Traducir</button>
      <p>{result}</p>
    </div>
  );
}
