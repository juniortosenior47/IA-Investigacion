import { supabase } from '../lib/supabase'

export interface WordTranslation {
  id: string
  word: string
  translation: string
  from_language: 'spanish' | 'english'
  to_language: 'spanish' | 'english'
  usage_count: number
  created_at: string
  updated_at: string
}

export class WordTranslationService {
  async getTranslation(
    word: string, 
    fromLang: 'spanish' | 'english', 
    toLang: 'spanish' | 'english'
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('word_translations')
        .select('translation')
        .eq('word', word.toLowerCase())
        .eq('from_language', fromLang)
        .eq('to_language', toLang)
        .single()

      if (error) {
        console.log(`Translation not found for: ${word}`)
        return null
      }

      // Increment usage count asynchronously (fire and forget)
      this.incrementUsageCount(word, fromLang, toLang)

      return data.translation
    } catch (error) {
      console.error('Error fetching translation:', error)
      return null
    }
  }

  async addTranslation(
    word: string,
    translation: string,
    fromLang: 'spanish' | 'english',
    toLang: 'spanish' | 'english'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('word_translations')
        .upsert({
          word: word.toLowerCase(),
          translation: translation.toLowerCase(),
          from_language: fromLang,
          to_language: toLang,
          usage_count: 1,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'word,from_language,to_language'
        })

      if (error) {
        console.error('Error adding translation:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error adding translation:', error)
      return false
    }
  }

  async getMostUsedTranslations(limit: number = 100): Promise<WordTranslation[]> {
    try {
      const { data, error } = await supabase
        .from('word_translations')
        .select('*')
        .order('usage_count', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching most used translations:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching most used translations:', error)
      return []
    }
  }

  private async incrementUsageCount(
    word: string,
    fromLang: 'spanish' | 'english',
    toLang: 'spanish' | 'english'
  ): Promise<void> {
    try {
      await supabase.rpc('increment_usage_count', {
        word_param: word.toLowerCase(),
        from_lang_param: fromLang,
        to_lang_param: toLang
      })
    } catch (error) {
      console.error('Error incrementing usage count:', error)
    }
  }
}