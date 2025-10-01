import { Container } from "../../../../src/config/container";

async function main() {
  const useCase = Container.getTranslateService();

  const words = (process.argv[2] || "la morfología es el estudio de las palabras").split(/\s+/);
  const from = process.argv[3] || "spanish";
  const to = process.argv[4] || "english";

  const translations = await useCase.translateArray(words, from, to);
  console.log(translations.join(' '));
}

main();
