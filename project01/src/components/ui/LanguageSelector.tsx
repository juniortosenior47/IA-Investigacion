import React from 'react'

interface LanguageSelectorProps {
  value: 'spanish' | 'english'
  onChange: (value: 'spanish' | 'english') => void
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as 'spanish' | 'english')}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="spanish">Español</option>
      <option value="english">English</option>
    </select>
  )
}