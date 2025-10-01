import { Container } from '../../config/container';

async function main() {
  const svc = Container.getTranslateService();
  const text = process.argv[2] || 'la morfologia es el estudio de las palabras';
  const words = text.split(/\s+/);
  const res = await svc.translateArray(words, 'spanish', 'english');
  console.log(res.join(' '));
}

main();
