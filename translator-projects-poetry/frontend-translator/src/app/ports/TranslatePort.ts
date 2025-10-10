import { Token } from '../domain/WordTokens'

export interface TranslatePort {
  translateMany(tokens: Token[]): Promise<Token[]>
}
