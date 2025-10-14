import { WordTokens } from "../domain/WordTokens";
import type { TranslatePort } from "../ports/TranslatePort";

export class TranslateUseCase {
  constructor(private readonly translator: TranslatePort) {}

  async execute(sentence: string): Promise<string> {
    const tokens = WordTokens.fromSentence(sentence);
    if (tokens.length === 0) throw new Error("Frase vacía o inválida");
    return this.translator.translateMany(tokens);
  }
}
