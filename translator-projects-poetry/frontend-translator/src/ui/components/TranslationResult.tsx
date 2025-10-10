import React from 'react'
export default function TranslationResult({ tokens } : { tokens: string[] | null }) {
  if (!tokens) return null
  return (
    <div className="mt-4">
      <h3 className="font-medium">Result</h3>
      <pre className="mt-2 p-3 bg-slate-100 rounded text-sm overflow-auto">{JSON.stringify(tokens, null, 2)}</pre>
      <div className="mt-2 p-3 bg-white border rounded">{tokens.join(' ')}</div>
    </div>
  )
}
