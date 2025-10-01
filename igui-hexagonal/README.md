# Hexagonal Project - Final

Proyecto de ejemplo con **arquitectura hexagonal** en TypeScript, incluyendo:
- Capa de dominio (puertos)
- Capa de aplicación (TranslateService)
- Adaptadores de salida (InMemoryWordRepository, ApiWordRepository)
- Adaptadores de entrada (CLI, React, Angular)
- Contenedor sencillo para inyección de dependencias (Container)

## Estructura clave
- `src/core/domain/WordRepository.ts` - puerto (interface)
- `src/core/application/TranslateService.ts` - caso de uso
- `src/adapters/output/InMemoryWordRepository.ts` - adaptador en memoria
- `src/adapters/input/cli/TranslateCliAdapter.ts` - adaptador CLI
- `src/adapters/input/ui/react-app` - React app
- `src/adapters/input/ui/angular-app` - Angular app
- `src/config/container.ts` - configuración DI

## Ejecutar (sugerencia)
1. Instalar dependencias raíz (opcional, UIs tienen sus propias deps):
   ```bash
   npm install
   ```
2. Compilar TypeScript:
   ```bash
   npx tsc
   ```
3. Ejecutar CLI (ejemplo):
   ```bash
   node dist/src/adapters/input/cli/TranslateCliAdapter.js "la morfología es el estudio de las palabras"
   ```
   Salida esperada: `the morphology is the study of the words` (según el diccionario en memoria).

## React UI
```bash
cd src/adapters/input/ui/react-app
npm install
npm start
```

## Angular UI
```bash
cd src/adapters/input/ui/angular-app
npm install
ng serve
```

## Cambiar repositorio
Para usar otro adaptador, edita `src/config/container.ts` y cambia la implementación devuelta por `getWordRepository()`.

