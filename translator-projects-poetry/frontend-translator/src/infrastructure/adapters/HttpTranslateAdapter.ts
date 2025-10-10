import { TranslatePort } from '../../app/ports/TranslatePort'
import { Token } from '../../app/domain/WordTokens'

export interface HttpTranslateAdapterConfig {
  baseUrl?: string
  prefix?: string
}

export class HttpTranslateAdapter implements TranslatePort {
  private baseUrl: string
  private prefix: string

  constructor(cfg: HttpTranslateAdapterConfig = {}) {
    this.baseUrl = cfg.baseUrl ?? (import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8000')
    this.prefix = cfg.prefix ?? (import.meta.env.VITE_PREFIX ?? 'translator:word:')
  }

  async translateMany(tokens: Token[]): Promise<Token[]> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/translate_many?prefix=${encodeURIComponent(this.prefix)}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tokens)
    })
    if (!res.ok) {
      const text = await res.text().catch(()=>res.statusText)
      throw new Error(`HTTP ${res.status}: ${text}`)
    }
    const data = await res.json()
    if (!Array.isArray(data)) throw new Error('Invalid response from translate endpoint')
    return data
  }
}
