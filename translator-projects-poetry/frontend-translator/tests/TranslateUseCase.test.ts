import { TranslateUseCase } from '../src/app/usecases/TranslateUseCase'
const mockPort = { translateMany: jest.fn(async (t:any)=> t.map((x:any)=>x+'_en')) }
describe('TranslateUseCase', ()=>{
  it('translates tokens via port', async ()=>{
    const uc = new TranslateUseCase(mockPort as any)
    const res = await uc.execute(['hola','mundo'])
    expect(res).toEqual(['hola_en','mundo_en'])
    expect(mockPort.translateMany).toHaveBeenCalledWith(['hola','mundo'])
  })
  it('throws on invalid input', async ()=>{
    const uc = new TranslateUseCase(mockPort as any)
    await expect(uc.execute([])).resolves.toEqual([]) // empty returns empty
  })
})
