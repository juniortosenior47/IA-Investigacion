import { WordRepository } from "../../core/domain/WordRepository";

export class InMemoryWordRepository implements WordRepository {
  private translations: Record<string, Record<string, string>> = {
    'spanish_english': {
      'la': 'the',
      'morfología': 'morphology',
      'hola': 'hello',
      'mundo': 'world'
    }
  };

  async getTranslation(word: string, fromLang: string, toLang: string): Promise<string | undefined> {
    const key = `${fromLang}_${toLang}`;
    return this.translations[key]?.[word.toLowerCase()];
  }
}

export const inMemoryWordRepository = new InMemoryWordRepository();
