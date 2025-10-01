import React from 'react'

interface Props {
  value: 'spanish' | 'english'
  onChange: (lang: 'spanish' | 'english') => void
}

export const LanguageSelector: React.FC<Props> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as 'spanish' | 'english')}
      className="p-2 border rounded"
    >
      <option value="spanish">Español</option>
      <option value="english">Inglés</option>
    </select>
  )
}
