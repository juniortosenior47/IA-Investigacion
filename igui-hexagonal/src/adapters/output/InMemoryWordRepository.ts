import { WordRepository } from "../../core/domain/WordRepository";

export class InMemoryWordRepository implements WordRepository {
  private translations: Record<string, Record<string, string>> = {
    'spanish_english': {
      'en': 'in',
      'lingüística': 'linguistics',
      'la': 'the',
      'morfología': 'morphology',
      'es': 'is',
      'el': 'the',
      'estudio': 'study',
      'de': 'of',
      'las': 'the',
      'palabras': 'words',
      'casa': 'house',
      'grande': 'big',
      'me': 'I',
      'gusta': 'like',
      'música': 'music',
      'perro': 'dog',
      'corre': 'runs',
      'rápido': 'fast',
      'estudiamos': 'we study',
      'español': 'Spanish',
      'comida': 'food',
      'está': 'is',
      'deliciosa': 'delicious'
    },
    'english_spanish': {
      'in': 'en',
      'linguistics': 'lingüística',
      'the': 'la',
      'morphology': 'morfología',
      'is': 'es',
      'study': 'estudio',
      'of': 'de',
      'words': 'palabras',
      'house': 'casa',
      'big': 'grande',
      'i': 'me',
      'like': 'gusta',
      'music': 'música',
      'dog': 'perro',
      'runs': 'corre',
      'fast': 'rápido',
      'we': 'estudiamos',
      'spanish': 'español',
      'food': 'comida',
      'delicious': 'deliciosa'
    }
  };

  async getTranslation(word: string, fromLang: string, toLang: string): Promise<string | undefined> {
    const key = `${fromLang}_${toLang}`;
    return this.translations[key]?.[word.toLowerCase()];
  }
}

export const wordRepository = new InMemoryWordRepository();
