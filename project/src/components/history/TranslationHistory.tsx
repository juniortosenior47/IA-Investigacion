import React, { useState, useEffect } from 'react'
import { History, Trash2, Copy, Check, Clock } from 'lucide-react'
import { TranslationApiService } from '../../services/translationService'
import { type Translation } from '../../lib/supabase'

interface TranslationHistoryProps {
  isOpen: boolean
  onClose: () => void
  onSelectTranslation: (originalText: string, fromLang: 'spanish' | 'english', toLang: 'spanish' | 'english') => void
}

export const TranslationHistory: React.FC<TranslationHistoryProps> = ({ 
  isOpen, 
  onClose, 
  onSelectTranslation 
}) => {
  const [translations, setTranslations] = useState<Translation[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const translationService = new TranslationApiService()

  useEffect(() => {
    if (isOpen) {
      loadHistory()
    }
  }, [isOpen])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const history = await translationService.getTranslationHistory(20)
      setTranslations(history)
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Error copying text:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const success = await translationService.deleteTranslation(id)
      if (success) {
        setTranslations(translations.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Error deleting translation:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Historial de Traducciones</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : translations.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">No hay traducciones guardadas aún</p>
              <p className="text-sm text-gray-500 mt-2">
                Tus traducciones aparecerán aquí automáticamente
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {translations.map((translation) => (
                <div
                  key={translation.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => {
                    onSelectTranslation(
                      translation.original_text,
                      translation.from_language,
                      translation.to_language
                    )
                    onClose()
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">
                        {translation.from_language === 'spanish' ? '🇪🇸 ES' : '🇺🇸 EN'}
                      </span>
                      <span>→</span>
                      <span className="font-medium">
                        {translation.to_language === 'spanish' ? '🇪🇸 ES' : '🇺🇸 EN'}
                      </span>
                      <span className="ml-auto text-xs">
                        {formatDate(translation.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopy(translation.translated_text, translation.id)
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Copiar traducción"
                      >
                        {copiedId === translation.id ? (
                          <Check size={16} className="text-green-600" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(translation.id)
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Original:</p>
                      <p className="text-gray-900">{translation.original_text}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Traducción:</p>
                      <p className="text-blue-700 font-medium">{translation.translated_text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}