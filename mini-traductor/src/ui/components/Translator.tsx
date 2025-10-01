import React, { useEffect, useState } from 'react'
import { LanguageSelector } from './LanguageSelector'
import { TextBox } from './TextBox'
import { TranslateService } from '../../application/TranslateService'
import { wordRepository } from '../../infrastructure/InMemoryWordRepository'

const service = new TranslateService(wordRepository)

export const Translator: React.FC = () => {
  const [fromLang, setFromLang] = useState<'spanish' | 'english'>('spanish')
  const [toLang, setToLang] = useState<'spanish' | 'english'>('english')
  const [fromText, setFromText] = useState('')
  const [toText, setToText] = useState('')

  useEffect(() => {
    if (!fromText.trim()) {
      setToText('')
      return
    }
    const words = fromText
      .split(/\s+/)
      .filter(Boolean)
    const translated = service.translateArray(words, fromLang, toLang)
    setToText(translated.join(' '))
  }, [fromText, fromLang, toLang])

  // helper to load the example 'words' array into the source textbox
  const loadExample = () => {
    const words = ['en','lingüística','la','morfología','es','el','estudio','de','las','palabras']
    setFromText(words.join(' '))
  }



   return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="p-4 text-2xl font-bold text-center text-gray-800">Mini Translator</header>
      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4">
        {/* Columna izquierda */}
        <div className="w-full md:w-1/2 flex flex-col">
          <LanguageSelector value={fromLang} onChange={setFromLang} />
          <TextBox text={fromText} onChange={setFromText} label="Texto original" />
          <button
            onClick={loadExample}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded self-start"
          >
            Cargar ejemplo
          </button>
        </div>
        {/* Columna derecha */}
        <div className="w-full md:w-1/2 flex flex-col">
          <LanguageSelector value={toLang} onChange={setToLang} />
          <TextBox text={toText} onChange={() => {}} label="Traducción" readOnly />
        </div>
      </main>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">✨ Mini Translator</h1>
            <p className="text-gray-600">Traduce instantáneamente entre idiomas</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Input Column */}
            <div className="flex-1 space-y-4">
              <LanguageSelector 
                value={fromLang} 
                onChange={setFromLang} 
                label="Idioma origen"
              />
              <TextArea
                text={fromText}
                onChange={setFromText}
                label="Texto a traducir"
                placeholder="Escribe aquí el texto que deseas traducir..."
              />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={loadRandomExample}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  Ejemplo aleatorio
                </button>
                {fromText && (
                  <button
                    onClick={() => speakText(fromText, fromLang)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                  >
                    <Volume2 size={16} />
                    Escuchar
                  </button>
                )}
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex lg:flex-col items-center justify-center">
              <button
                onClick={swapLanguages}
                disabled={!fromText && !toText}
                className={`p-3 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                  isSwapping ? 'rotate-180' : ''
                }`}
                title="Intercambiar idiomas"
              >
                <ArrowLeftRight size={20} className="transition-transform duration-300" />
              </button>
            </div>

            {/* Output Column */}
            <div className="flex-1 space-y-4">
              <LanguageSelector 
                value={toLang} 
                onChange={setToLang} 
                label="Idioma destino"
              />
              <TextArea
                text={toText}
                onChange={() => {}}
                label="Traducción"
                placeholder="La traducción aparecerá aquí..."
                readOnly
                isLoading={isLoading}
              />
              <div className="flex flex-wrap gap-2">
                {toText && !isLoading && (
                  <button
                    onClick={() => speakText(toText, toLang)}
                    className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                  >
                    <Volume2 size={16} />
                    Escuchar traducción
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Examples */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Frases populares</h2>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setFromText(example)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>Traductor impulsado por tecnología avanzada ✨</p>
        </div>
      </footer>
    </div>
  );
}
