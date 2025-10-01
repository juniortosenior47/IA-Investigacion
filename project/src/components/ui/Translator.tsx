import React, { useEffect, useState } from 'react'
import { ArrowLeftRight, Copy, RotateCcw, Volume2, Check, X, Sparkles, History, User, LogOut } from 'lucide-react'
import { LanguageSelector } from './LanguageSelector'
import { TextBox } from './TextBox'
import { TranslateService } from '../../application/TranslateService'
import { HybridWordRepository } from '../../infrastructure/HybridWordRepository'
import { TranslationApiService } from '../../services/translationService'
import { AuthModal } from '../auth/AuthModal'
import { TranslationHistory } from '../history/TranslationHistory'
import { supabase } from '../../lib/supabase'

const hybridRepository = new HybridWordRepository()
const service = new TranslateService(hybridRepository)
const translationApiService = new TranslationApiService()

// Enhanced TextBox component with modern styling
interface EnhancedTextBoxProps {
  text: string
  onChange: (value: string) => void
  label: string
  readOnly?: boolean
  placeholder?: string
}

const EnhancedTextBox: React.FC<EnhancedTextBoxProps> = ({ 
  text, 
  onChange, 
  label, 
  readOnly = false,
  placeholder = ""
}) => {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    if (text.trim()) {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClear = () => {
    onChange('')
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {text.length} caracteres
          </span>
          {text && !readOnly && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
              title="Limpiar texto"
            >
              <X size={14} />
            </button>
          )}
          {text && readOnly && (
            <button
              onClick={handleCopy}
              className={`transition-all duration-200 p-1 rounded-full ${
                copied 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
              title="Copiar texto"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          )}
        </div>
      </div>
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full h-40 p-4 border-2 rounded-xl resize-none transition-all duration-200 text-gray-800 placeholder-gray-400 ${
            readOnly 
              ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 focus:ring-2 focus:ring-gray-300 focus:border-gray-300' 
              : 'bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300'
          }`}
        />
        {readOnly && text && (
          <div className="absolute top-3 right-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  )
}

// Enhanced LanguageSelector with modern styling
interface EnhancedLanguageSelectorProps {
  value: 'spanish' | 'english'
  onChange: (value: 'spanish' | 'english') => void
  label: string
}

const EnhancedLanguageSelector: React.FC<EnhancedLanguageSelectorProps> = ({ 
  value, 
  onChange, 
  label 
}) => {
  const languages = {
    spanish: { name: 'Español', flag: '🇪🇸' },
    english: { name: 'English', flag: '🇺🇸' }
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as 'spanish' | 'english')}
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer hover:border-gray-300 text-gray-800 font-medium"
        >
          {Object.entries(languages).map(([code, lang]) => (
            <option key={code} value={code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <div className="text-xl">{languages[value].flag}</div>
        </div>
      </div>
    </div>
  )
}

export const Translator: React.FC = () => {
  const [fromLang, setFromLang] = useState<'spanish' | 'english'>('spanish')
  const [toLang, setToLang] = useState<'spanish' | 'english'>('english')
  const [fromText, setFromText] = useState('')
  const [toText, setToText] = useState('')
  const [isSwapping, setIsSwapping] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [lastSavedTranslation, setLastSavedTranslation] = useState<{original: string, translated: string} | null>(null)

  // Check authentication status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!fromText.trim()) {
      setToText('')
      setLastSavedTranslation(null)
      return
    }
    const words = fromText
      .split(/\s+/)
      .filter(Boolean)
    const translated = service.translateArray(words, fromLang, toLang)
    const translatedText = translated.join(' ')
    setToText(translatedText)

    // Auto-save translation if user is authenticated and translation is different
    if (user && fromText.trim() && translatedText.trim()) {
      const currentTranslation = { original: fromText.trim(), translated: translatedText.trim() }
      
      if (!lastSavedTranslation || 
          lastSavedTranslation.original !== currentTranslation.original ||
          lastSavedTranslation.translated !== currentTranslation.translated) {
        
        // Debounce the save operation
        const timeoutId = setTimeout(async () => {
          await translationApiService.saveTranslation(
            fromText.trim(),
            translatedText.trim(),
            fromLang,
            toLang
          )
          setLastSavedTranslation(currentTranslation)
        }, 1000)

        return () => clearTimeout(timeoutId)
      }
    }
  }, [fromText, fromLang, toLang])

  const loadExample = () => {
    const words = ['en','lingüística','la','morfología','es','el','estudio','de','las','palabras']
    setFromText(words.join(' '))
  }

  const swapLanguages = () => {
    setIsSwapping(true)
    const tempLang = fromLang
    const tempText = fromText
    
    setFromLang(toLang)
    setToLang(tempLang)
    setFromText(toText)
    setToText(tempText)
    
    setTimeout(() => setIsSwapping(false), 300)
  }

  const speakText = (text: string, lang: 'spanish' | 'english') => {
    if ('speechSynthesis' in window && text.trim()) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === 'english' ? 'en-US' : 'es-ES'
      speechSynthesis.speak(utterance)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const handleSelectFromHistory = (originalText: string, fromLang: 'spanish' | 'english', toLang: 'spanish' | 'english') => {
    setFromText(originalText)
    setFromLang(fromLang)
    setToLang(toLang)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
  }

  const quickExamples = [
    'la casa es grande',
    'me gusta la música',
    'el perro corre rápido',
    'estudiamos español',
    'la comida está deliciosa'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Sparkles className="text-blue-600" size={32} />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Mini Translator
                </h1>
              </div>
              <p className="text-gray-600 text-lg">Traduce instantáneamente entre español e inglés</p>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <button
                    onClick={() => setShowHistory(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                  >
                    <History size={18} />
                    Historial
                  </button>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <User size={18} className="text-gray-600" />
                    <span className="text-sm text-gray-700">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="Cerrar sesión"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
                >
                  <User size={18} />
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Input Column */}
            <div className="flex-1 space-y-6">
              <EnhancedLanguageSelector 
                value={fromLang} 
                onChange={setFromLang} 
                label="Idioma origen"
              />
              <EnhancedTextBox
                text={fromText}
                onChange={setFromText}
                label="Texto original"
                placeholder="Escribe aquí el texto que deseas traducir..."
              />
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={loadExample}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <RotateCcw size={16} />
                  Cargar ejemplo
                </button>
                {fromText && (
                  <button
                    onClick={() => speakText(fromText, fromLang)}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg"
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
                className={`p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                  isSwapping ? 'rotate-180' : ''
                }`}
                title="Intercambiar idiomas"
              >
                <ArrowLeftRight size={24} className="transition-transform duration-300" />
              </button>
            </div>

            {/* Output Column */}
            <div className="flex-1 space-y-6">
              <EnhancedLanguageSelector 
                value={toLang} 
                onChange={setToLang} 
                label="Idioma destino"
              />
              <EnhancedTextBox
                text={toText}
                onChange={() => {}}
                label="Traducción"
                placeholder="La traducción aparecerá aquí automáticamente..."
                readOnly
              />
              {isTranslating && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Traduciendo...
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                {toText && (
                  <button
                    onClick={() => speakText(toText, toLang)}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
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
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Ejemplos rápidos</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {quickExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => setFromText(example)}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 font-medium"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Sparkles size={20} className="text-blue-500" />
            <p className="text-lg">Traductor inteligente con tecnología avanzada</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Translation History */}
      <TranslationHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectTranslation={handleSelectFromHistory}
      />
    </div>
  )
}