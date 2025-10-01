import React from 'react'
import { Translator } from './components/Translator'

const App: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mini Traductor (Arquitectura Hexagonal)</h1>
      <p className="mb-4 text-sm text-gray-700">Escribe en la caja izquierda (o presiona "Cargar ejemplo") y verás la traducción usando el repositorio en memoria.</p>
      <Translator />
    </div>
  )
}

export default App
