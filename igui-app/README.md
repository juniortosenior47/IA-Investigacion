# 📘 Translator App - Arquitectura Hexagonal

Este proyecto es un ejemplo de implementación de una **arquitectura hexagonal** en **TypeScript**, con un **backend REST en Express** y una **interfaz web en React (Vite)**.  

El sistema permite traducir texto entre **español** e **inglés**, soportando repositorios en memoria (`InMemoryWordRepository`) y un repositorio híbrido con caché + servicio simulado (`HybridWordRepository`).  

## 🚀 Características

- **Arquitectura hexagonal (puertos y adaptadores)**  
  - **Dominio**: Interfaces (`WordRepository`) y lógica de negocio (`TranslateService`).  
  - **Adaptadores de salida**: Implementaciones del repositorio (`InMemoryWordRepository`, `HybridWordRepository`).  
  - **Adaptadores de entrada**:  
    - CLI (ejecución por consola).  
    - REST API con Express.  
    - UI en React (Vite) que consume la API.  

- **Repositorios**:
  - `InMemoryWordRepository`: diccionario embebido.  
  - `HybridWordRepository`: caché en memoria + servicio simulado `WordTranslationService`.  

- **Docker Compose**: levanta **dos servicios**:
  - `api` → Backend Express en puerto `3000`.  
  - `ui` → Frontend React en puerto `5173`.  

---

## 📂 Estructura del Proyecto

```
translator-app/
├── src/
│   ├── core/
│   │   ├── domain/                # Interfaces de dominio
│   │   │   └── WordRepository.ts
│   │   └── application/           # Casos de uso (lógica de negocio)
│   │       └── TranslateService.ts
│   │
│   ├── services/                  # Servicios externos simulados
│   │   └── wordTranslationService.ts
│   │
│   ├── adapters/
│   │   ├── output/                # Adaptadores de salida (repositorios)
│   │   │   ├── InMemoryWordRepository.ts
│   │   │   └── HybridWordRepository.ts
│   │   └── input/                 # Adaptadores de entrada
│   │       ├── cli/TranslateCliAdapter.ts
│   │       ├── rest/TranslateRestAdapter.ts
│   │       └── ui/react-app/      # UI React (Vite)
│   │           ├── package.json
│   │           ├── vite.config.ts
│   │           └── src/
│   │               ├── App.tsx
│   │               ├── main.tsx
│   │               └── index.html
│   │
│   └── config/                    # Contenedor de dependencias
│       └── container.ts
│
├── Dockerfile.rest                 # Backend (API Express)
├── Dockerfile.ui                   # Frontend (React Vite)
├── docker-compose.yml              # Orquestación de servicios
├── package.json                    # Configuración de Node/TS
├── tsconfig.json                   # Configuración de TypeScript
└── README.md
```

---

## ▶️ Cómo Ejecutar

### 1. Clonar el repositorio o extraer el ZIP
```bash
unzip translator-app-docker.zip
cd translator-app-docker
```

### 2. Levantar con Docker Compose
```bash
docker-compose up --build
```

Esto construirá las imágenes y levantará:

- **Backend API** en [http://localhost:3000](http://localhost:3000)  
- **Frontend React** en [http://localhost:5173](http://localhost:5173)  

### 3. Probar API directamente
```bash
curl -X POST http://localhost:3000/translate   -H "Content-Type: application/json"   -d '{"text":"hola mundo","fromLang":"spanish","toLang":"english"}'
```

Respuesta:
```json
{ "translated": "hello world" }
```

### 4. Usar la UI
Abrir [http://localhost:5173](http://localhost:5173), escribir un texto en español y hacer clic en **Traducir**.  
El frontend enviará la petición al backend REST.

---

## ⚙️ Modos de Repositorio

El archivo `src/config/container.ts` permite seleccionar el repositorio a usar:

```ts
static mode: 'memory' | 'hybrid' = 'hybrid';
```

- `memory` → Traducción rápida con diccionario embebido.  
- `hybrid` → Traducción con caché en memoria y servicio externo simulado.  

---

## 📌 Próximos pasos / mejoras

- Agregar base de datos real (PostgreSQL).  
- Manejo de CORS en el backend.  
- Implementar métricas y health checks.  
- Añadir nuevos idiomas y repositorios externos.  

---
