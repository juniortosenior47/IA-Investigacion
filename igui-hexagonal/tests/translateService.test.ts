import { TranslateService } from '../src/core/application/TranslateService';
import { InMemoryWordRepository } from '../src/adapters/output/InMemoryWordRepository';

test('translate array with in-memory repository', async () => {
  const repo = new InMemoryWordRepository();
  const svc = new TranslateService(repo);
  const res = await svc.translateArray(['la','casa','grande'], 'spanish', 'english');
  expect(res).toEqual(['the','house','big']);
});
