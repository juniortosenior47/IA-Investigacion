export interface WordRepository {
  getTranslation(word: string, fromLang: string, toLang: string): string | undefined
}

export class TranslateService {
  constructor(private wordRepository: WordRepository) {}

  translateArray(words: string[], fromLang: string, toLang: string): string[] {
    return words.map(word => {
      const translation = this.wordRepository.getTranslation(word.toLowerCase(), fromLang, toLang)
      return translation || word
    })
  }
}