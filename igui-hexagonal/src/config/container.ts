import { wordRepository } from "../adapters/output/InMemoryWordRepository";
// import { ApiWordRepository } from "../adapters/output/ApiWordRepository";

import { TranslateService } from "../core/application/TranslateService";

export class Container {
  // flip to true to use other implementations if provided
  static useInMemory = true;

  static getWordRepository() {
    if (this.useInMemory) return wordRepository;
    // return new ApiWordRepository();
    return wordRepository;
  }

  static getTranslateService() {
    return new TranslateService(this.getWordRepository());
  }
}
