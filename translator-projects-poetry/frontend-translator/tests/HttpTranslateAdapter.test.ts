import { HttpTranslateAdapter } from '../src/infrastructure/adapters/HttpTranslateAdapter'
global.fetch = jest.fn()
describe('HttpTranslateAdapter', ()=>{
  beforeEach(()=> (fetch as jest.Mock).mockReset())
  it('calls fetch and returns tokens', async ()=>{
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async ()=> ['a','b']
    })
    const adapter = new HttpTranslateAdapter({ baseUrl: 'http://localhost:8000', prefix: 'translator:word:' })
    const res = await adapter.translateMany(['x'])
    expect(res).toEqual(['a','b'])
    expect(fetch).toHaveBeenCalled()
  })
  it('throws on non-ok', async ()=>{
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async ()=> 'err'
    })
    const adapter = new HttpTranslateAdapter({ baseUrl: 'http://localhost:8000', prefix: 'translator:word:' })
    await expect(adapter.translateMany(['x'])).rejects.toThrow('HTTP 500')
  })
})
