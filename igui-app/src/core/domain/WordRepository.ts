export interface WordRepository {
  getTranslation(word: string, fromLang: string, toLang: string): Promise<string | undefined>;
}
