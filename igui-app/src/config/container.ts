import { inMemoryWordRepository } from "../adapters/output/InMemoryWordRepository";
import { HybridWordRepository } from "../adapters/output/HybridWordRepository";
import { TranslateService } from "../core/application/TranslateService";

export class Container {
  static mode: 'memory' | 'hybrid' = 'hybrid';

  static getWordRepository() {
    if (this.mode === 'hybrid') return new HybridWordRepository();
    return inMemoryWordRepository;
  }

  static getTranslateService() {
    return new TranslateService(this.getWordRepository());
  }
}
