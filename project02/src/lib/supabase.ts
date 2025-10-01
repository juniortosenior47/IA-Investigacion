import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Translation = {
  id: string
  user_id: string
  original_text: string
  translated_text: string
  from_language: 'spanish' | 'english'
  to_language: 'spanish' | 'english'
  created_at: string
  updated_at: string
}