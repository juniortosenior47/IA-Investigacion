import { WordRepository } from "../../core/domain/WordRepository";

export class ApiWordRepository implements WordRepository {
  async getTranslation(word: string, fromLang: string, toLang: string): Promise<string | undefined> {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${fromLang}|${toLang}`;
    const res = await fetch(url);
    const data = await res.json();
    return data?.responseData?.translatedText || undefined;
  }
}
