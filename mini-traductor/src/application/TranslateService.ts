import { Word } from '../domain/Word'

export class TranslateService {
  constructor(private words: Word[]) {}

  translateArray(wordsArr: string[], from: 'spanish' | 'english', to: 'spanish' | 'english') {
    return wordsArr.map(w => {
      const found = this.words.find(item => item[from].toLowerCase() === w.toLowerCase())
      return found ? (found[to] || w) : w
    })
  }
}
