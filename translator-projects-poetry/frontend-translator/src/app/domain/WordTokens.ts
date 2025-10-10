export type Token = string

export class WordTokens {
  private tokens: Token[]

  constructor(tokens: Token[]) {
    if (!Array.isArray(tokens)) throw new Error('tokens must be array')
    this.tokens = tokens.map(t => String(t))
  }

  toArray(): Token[] { return [...this.tokens] }

  static fromText(value: string): WordTokens {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return new WordTokens(parsed)
    } catch {}
    const tokens = value.trim().split(/\s+/).filter(Boolean)
    return new WordTokens(tokens)
  }
}
