import { TranslatePort } from '../ports/TranslatePort'
import { Token } from '../domain/WordTokens'

export class TranslateUseCase {
  private port: TranslatePort
  constructor(port: TranslatePort) { this.port = port }
  async execute(tokens: Token[]): Promise<Token[]> {
    if (!Array.isArray(tokens)) throw new Error('tokens must be array')
    if (tokens.length === 0) return []
    // place for business rules, caching, etc.
    const result = await this.port.translateMany(tokens)
    return result
  }
}
