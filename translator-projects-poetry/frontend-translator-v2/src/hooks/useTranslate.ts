import { useState } from "react";
import { TranslateUseCase } from "../app/usecases/TranslateUseCase";
import { HttpTranslateAdapter } from "../infrastructure/adapters/HttpTranslateAdapter";

export function useTranslate(baseUrl: string, prefix: string) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const useCase = new TranslateUseCase(new HttpTranslateAdapter(baseUrl, prefix));

  const translate = async (sentence: string) => {
    setLoading(true);
    setError(null);
    try {
      const phrase = await useCase.execute(sentence);
      setResult(phrase);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, result, error, translate };
}
