export class WordTokens {
  static fromSentence(sentence: string): string[] {
    const lower = sentence.trim().toLowerCase();
    const tokens = lower.match(/[a-záéíóúüñ]+|[.,!?;:()]/gi);
    return tokens ? tokens : [];
  }
}
