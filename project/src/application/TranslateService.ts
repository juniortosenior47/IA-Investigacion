export interface WordRepository {
  getTranslation(word: string, fromLang: string, toLang: string): Promise<string | undefined>
}

export class TranslateService {
  constructor(private wordRepository: WordRepository) {}

  async translateArray(words: string[], fromLang: string, toLang: string): Promise<string[]> {
    const translations = await Promise.all(words.map(async word => {
      const translation = await this.wordRepository.getTranslation(word.toLowerCase(), fromLang, toLang)
      return translation || word
    }))
    
    return translations
  }
}