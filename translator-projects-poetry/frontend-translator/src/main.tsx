import React from 'react'
import { createRoot } from 'react-dom/client'
import TranslatorPage from './ui/pages/TranslatorPage'
import './index.css'

const root = document.getElementById('root')!
createRoot(root).render(<TranslatorPage />)
