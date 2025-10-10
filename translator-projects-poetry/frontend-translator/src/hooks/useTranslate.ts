import { useState, useMemo } from 'react'
import { HttpTranslateAdapter } from '../infrastructure/adapters/HttpTranslateAdapter'
import { TranslateUseCase } from '../app/usecases/TranslateUseCase'
import { WordTokens } from '../app/domain/WordTokens'

export function useTranslate() {
  const adapter = useMemo(()=> new HttpTranslateAdapter(), [])
  const usecase = useMemo(()=> new TranslateUseCase(adapter), [adapter])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string[] | null>(null)

  async function translateFromText(value: string) {
    setError(null); setResult(null); setLoading(true)
    try {
      const tokens = WordTokens.fromText(value).toArray()
      const translated = await usecase.execute(tokens)
      setResult(translated)
    } catch (e:any) {
      setError(e.message || String(e))
    } finally { setLoading(false) }
  }

  return { translateFromText, loading, error, result }
}
