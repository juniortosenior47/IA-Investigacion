export interface WordTranslation {
  word: string;
  from_language: 'spanish' | 'english';
  to_language: 'spanish' | 'english';
  translation: string;
  usage_count: number;
}

export class WordTranslationService {
  private db: WordTranslation[] = [
    { word: 'hola', from_language: 'spanish', to_language: 'english', translation: 'hello', usage_count: 50 },
    { word: 'mundo', from_language: 'spanish', to_language: 'english', translation: 'world', usage_count: 40 },
    { word: 'la', from_language: 'spanish', to_language: 'english', translation: 'the', usage_count: 40 },
    { word: 'morfología', from_language: 'spanish', to_language: 'english', translation: 'morphology', usage_count: 20 },
  ];

  async getTranslation(word: string, fromLang: 'spanish' | 'english', toLang: 'spanish' | 'english'): Promise<string | undefined> {
    const found = this.db.find(d => d.word.toLowerCase() === word.toLowerCase() && d.from_language === fromLang && d.to_language === toLang);
    return found ? found.translation : undefined;
  }

  async getMostUsedTranslations(limit: number): Promise<WordTranslation[]> {
    return this.db.slice().sort((a,b)=>b.usage_count - a.usage_count).slice(0, limit);
  }
}
