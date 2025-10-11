import { useState } from "react";
import { useTranslate } from "../../hooks/useTranslate";

export default function TranslatorPage() {
  const [input, setInput] = useState("");
  const { loading, result, error, translate } = useTranslate(
    import.meta.env.VITE_BACKEND_URL,
    import.meta.env.VITE_PREFIX
  );

  const handleTranslate = () => {
    if (input.trim()) translate(input);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Traductor Español → Inglés</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe una frase en español..."
        className="w-full max-w-xl p-3 border rounded-lg shadow-sm"
        rows={4}
      />
      <button
        onClick={handleTranslate}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Traducir
      </button>
      {loading && <p className="mt-4 text-gray-600">Traduciendo...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {result && (
        <p className="mt-4 text-lg text-green-700 font-semibold">{result}</p>
      )}
    </div>
  );
}
