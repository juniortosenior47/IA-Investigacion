import React, { useState, useMemo } from 'react'

function HttpTranslateAdapter({ baseUrl = import.meta.env.VITE_BACKEND_URL, prefix = import.meta.env.VITE_PREFIX } = {}) {
  async function translateMany(tokens) {
    const url = `${baseUrl.replace(/\/$/, '')}/translate_many?prefix=${encodeURIComponent(prefix)}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tokens)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  }
  return { translateMany }
}

function TranslateService({ translatePort }) {
  async function translateTokens(tokens) {
    if (!Array.isArray(tokens)) throw new Error('tokens must be an array')
    return await translatePort.translateMany(tokens)
  }
  return { translateTokens }
}

function prettyJson(v) { try { return JSON.stringify(v, null, 2) } catch(e) { return String(v) } }

export default function TranslatorApp() {
  const defaultTokens = ['en','lingüística',',','la','morfología','es','el','estudio','de','las','palabras','.']
  const [inputText, setInputText] = useState(JSON.stringify(defaultTokens))
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const translatePort = useMemo(() => HttpTranslateAdapter(), [])
  const service = useMemo(() => TranslateService({ translatePort }), [translatePort])

  async function handleTranslate() {
    setError(null); setResult(null); setLoading(true)
    try {
      const parsed = JSON.parse(inputText)
      const translated = await service.translateTokens(parsed)
      setResult(translated)
    } catch (e) {
      setError(String(e.message || e))
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Translator — Spanish → English</h1>
        <textarea className="w-full border p-3 rounded mb-3" value={inputText} onChange={e=>setInputText(e.target.value)} rows={5}/>
        <button onClick={handleTranslate} className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Translating...' : 'Translate'}</button>
        {error && <div className="text-red-500 mt-3">Error: {error}</div>}
        {result && <pre className="mt-4 bg-gray-100 p-3 rounded text-sm overflow-auto">{prettyJson(result)}</pre>}
      </div>
    </div>
  )
}
