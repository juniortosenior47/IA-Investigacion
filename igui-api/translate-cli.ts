import { ApiTranslatorAdapter } from "./src/infrastructure/ApiTranslatorAdapter";
import { TranslateWord } from "./src/core/application/TranslateWord";

async function main() {
  const translator = new ApiTranslatorAdapter();
  const useCase = new TranslateWord(translator);

  const word = process.argv[2] || "hola";
  const from = process.argv[3] || "es";
  const to = process.argv[4] || "en";

  const result = await useCase.execute(word, from, to);
  console.log(`Traducción [${from} -> ${to}]: ${result}`);
}

main();
