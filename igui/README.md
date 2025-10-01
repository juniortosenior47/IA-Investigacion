# Hexagonal Project (TypeScript + React + Angular + Docker)

Proyecto de ejemplo con **arquitectura hexagonal** implementada en **TypeScript**, con dos frontends (React y Angular), pruebas con Jest y despliegue mediante Docker.

---

## 📂 Estructura del Proyecto

```
hexagonal-project/
│── Dockerfile
│── docker-compose.yml
│── package.json
│── tsconfig.json
│── jest.config.js
│── /src
│   ├── core/                # Dominio + casos de uso
│   │   ├── domain/          # Entidades (Word, etc.)
│   │   ├── application/     # Casos de uso (TranslateWord)
│   │   └── ports/           # Interfaces (ITranslator)
│   ├── infrastructure/      # Adaptadores
│   │   ├── FakeTranslatorAdapter.ts
│   │   └── ApiTranslatorAdapter.ts  # Consumo de API real
│   └── ui/
│       ├── react-app/       # Frontend React
│       └── angular-app/     # Frontend Angular
│
└── /tests                   # Pruebas Jest
```

---

## 🔹 Adaptadores de Traducción

- `FakeTranslatorAdapter` → devuelve una traducción simulada en mayúsculas.
- `ApiTranslatorAdapter` → consume la API pública de [MyMemory](https://mymemory.translated.net/doc/spec.php) para traducir.

---

## 🔹 Frontend

- **React App** (`http://localhost:3000`)  
- **Angular App** (`http://localhost:4200`)  

Ambos permiten elegir si se usa el adaptador **Fake** o el adaptador **API real**.

---

## ▶️ Ejecutar Localmente

```bash
# Instalar dependencias raíz (core + tests)
npm install

# Correr pruebas
npm test

# Levantar React manualmente
cd src/ui/react-app
npm install
npm start

# Levantar Angular manualmente
cd src/ui/angular-app
npm install
npm start
```

---

## 🐳 Despliegue con Docker

El proyecto incluye `Dockerfile` multi-stage y `docker-compose.yml`.

### 1. Construir la imagen
```bash
docker-compose build
```

### 2. Levantar servicios
```bash
docker-compose up
```

### 3. Acceder a las apps
- React → [http://localhost:3000](http://localhost:3000)  
- Angular → [http://localhost:4200](http://localhost:4200)  

---

## 💻 Probar el Adaptador de API en Node.js (CLI)

Si no quieres levantar el frontend, puedes probar directamente el **ApiTranslatorAdapter** desde consola.

### 1. Crear archivo `translate-cli.ts`

```ts
import { ApiTranslatorAdapter } from "./src/infrastructure/ApiTranslatorAdapter";
import { TranslateWord } from "./src/core/application/TranslateWord";

async function main() {
  const translator = new ApiTranslatorAdapter();
  const useCase = new TranslateWord(translator);

  const word = process.argv[2] || "hola";
  const from = process.argv[3] || "es";
  const to = process.argv[4] || "en";

  const result = await useCase.execute(word, from, to);
  console.log(`Traducción [${from} -> ${to}]: ${result}`);
}

main();
```

### 2. Compilar y ejecutar

```bash
# Compilar el proyecto
npx tsc

# Ejecutar con Node (ejemplo: traducir "hola" de español a inglés)
node dist/translate-cli.js "hola" es en
```

📌 Resultado esperado:
```
Traducción [es -> en]: hello
```

---

## ✅ Resumen

- Arquitectura **hexagonal** para separar dominio, infraestructura y UI.  
- Frontends en **React** y **Angular**.  
- Adaptadores intercambiables (**Fake** y **API real**).  
- **Docker** para despliegue rápido.  
- **CLI** para probar traducciones sin frontend.
