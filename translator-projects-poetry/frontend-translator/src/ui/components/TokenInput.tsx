import React from 'react'
export default function TokenInput({ value, onChange }: { value: string, onChange: (v:string)=>void }) {
  return (
    <div>
      <label className="text-sm font-medium">Input tokens (JSON array or text)</label>
      <textarea value={value} onChange={e=>onChange(e.target.value)} rows={6}
        className="w-full p-3 border rounded mt-2 font-mono text-sm" />
    </div>
  )
}
