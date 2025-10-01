import React from 'react'

interface TextBoxProps {
  text: string
  onChange: (value: string) => void
  label: string
  readOnly?: boolean
}

export const TextBox: React.FC<TextBoxProps> = ({ text, onChange, label, readOnly = false }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className={`w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          readOnly ? 'bg-gray-50' : 'bg-white'
        }`}
        placeholder={readOnly ? 'La traducción aparecerá aquí...' : 'Escribe tu texto aquí...'}
      />
    </div>
  )
}