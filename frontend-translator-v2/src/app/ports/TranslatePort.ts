export interface TranslatePort {
  translateMany(tokens: string[]): Promise<string>;
}
