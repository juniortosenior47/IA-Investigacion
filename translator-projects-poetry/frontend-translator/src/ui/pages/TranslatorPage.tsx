import React, { useState } from 'react'
import TokenInput from '../components/TokenInput'
import TranslationResult from '../components/TranslationResult'
import Loader from '../components/Loader'
import { useTranslate } from '../../hooks/useTranslate'

export default function TranslatorPage(){
  const defaultTokens = JSON.stringify(['en','lingüística',',','la','morfología','es','el','estudio','de','las','palabras','.'])
  const [text, setText] = useState(defaultTokens)
  const { translateFromText, loading, error, result } = useTranslate()

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold mb-4">Translator — Spanish → English (TS Hexagonal)</h1>
        <TokenInput value={text} onChange={setText} />
        <div className="mt-4 flex gap-2">
          <button onClick={()=>translateFromText(text)} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>Translate</button>
          <button onClick={()=>setText(defaultTokens)} className="px-4 py-2 border rounded">Reset</button>
        </div>
        {loading && <div className="mt-4"><Loader /></div>}
        {error && <div className="mt-4 text-red-600">Error: {error}</div>}
        <TranslationResult tokens={result} />
      </div>
    </div>
  )
}
