import { ITranslator } from "../core/ports/ITranslator";

export class ApiTranslatorAdapter implements ITranslator {
  async translate(text: string, from: string, to: string): Promise<string> {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error en API de traducción");
    const data = await response.json();
    return data.responseData.translatedText;
  }
}
