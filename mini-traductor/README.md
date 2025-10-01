# Mini Translator

Proyecto Vite + React + TypeScript + TailwindCSS con arquitectura hexagonal.

## Setup

```bash
# instalar dependencias
npm install

# levantar en modo desarrollo
npm run dev
```

Abre http://localhost:5173

## Qué incluye

- `src/domain`, `src/application`, `src/infrastructure`, `src/ui`
- Ejemplo en memoria de palabras y un servicio de traducción simple.


Estructura de carpetas

src/
 ├── application/
 │    └── TranslateService.ts
 ├── domain/
 │    └── Word.ts
 ├── infrastructure/
 │    └── InMemoryWordRepository.ts
 ├── ui/
 │    ├── components/
 │    │     ├── LanguageSelector.tsx
 │    │     ├── TextBox.tsx
 │    │     └── Translator.tsx
 │    └── App.tsx
 └── index.tsx

