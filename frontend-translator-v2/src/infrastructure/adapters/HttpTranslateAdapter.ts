import type { TranslatePort } from "../../app/ports/TranslatePort";

interface TranslationResponse {
  diccionary: Record<string, string>;
  phrase: string;
}

export class HttpTranslateAdapter implements TranslatePort {
  constructor(private readonly baseUrl: string, private readonly prefix: string) {}

  async translateMany(tokens: string[]): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/translate_many?prefix=${encodeURIComponent(this.prefix)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tokens),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error en la traducción: ${text}`);
    }

    const data: TranslationResponse = await response.json();
    return data.phrase;
  }
}
