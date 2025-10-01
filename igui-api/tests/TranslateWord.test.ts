import { TranslateWord } from "../src/core/application/TranslateWord";
import { FakeTranslatorAdapter } from "../src/infrastructure/FakeTranslatorAdapter";
test('traduce palabra usando adaptador falso', async () => { const t=new FakeTranslatorAdapter(); const uc=new TranslateWord(t); const result=await uc.execute('hola','es','en'); expect(result).toBe('[es->en] HOLA'); });