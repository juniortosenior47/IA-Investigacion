import React from 'react'

interface Props {
  text: string
  onChange: (t: string) => void
  label: string
  readOnly?: boolean
}

export const TextBox: React.FC<Props> = ({ text, onChange, label, readOnly=false }) => {
  return (
    <div className="flex flex-col w-full">
      <label className="mb-1 font-semibold">{label}</label>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border rounded h-40 resize-none"
        readOnly={readOnly}
      />
    </div>
  )
}
