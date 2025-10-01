import { supabase, type Translation } from '../lib/supabase'

export class TranslationApiService {
  async saveTranslation(
    originalText: string,
    translatedText: string,
    fromLanguage: 'spanish' | 'english',
    toLanguage: 'spanish' | 'english'
  ): Promise<Translation | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.warn('User not authenticated, translation not saved')
        return null
      }

      const { data, error } = await supabase
        .from('translations')
        .insert({
          user_id: user.id,
          original_text: originalText,
          translated_text: translatedText,
          from_language: fromLanguage,
          to_language: toLanguage
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving translation:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error saving translation:', error)
      return null
    }
  }

  async getTranslationHistory(limit: number = 10): Promise<Translation[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return []
      }

      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching translation history:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching translation history:', error)
      return []
    }
  }

  async deleteTranslation(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting translation:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting translation:', error)
      return false
    }
  }
}