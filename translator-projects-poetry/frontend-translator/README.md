# Translator Frontend — Hexagonal (TypeScript + React)

This project is a React + TypeScript frontend demonstrating a Hexagonal architecture (Ports & Adapters) for translating tokens via an HTTP backend `/translate_many` endpoint.

## Structure
- `src/app` - Domain, ports, usecases
- `src/infrastructure` - Adapters (HTTP)
- `src/ui` - React components and pages
- `src/hooks` - Reusable hooks (useTranslate)
- `tests` - Jest unit tests for usecase and adapter

## Run locally
1. `npm install`
2. `npm run dev`

## Run with Docker
`docker compose up --build`

Frontend will be at `http://localhost:5173` (mapped to container port 80). Backend expected at `http://localhost:8000` — adjust `.env` accordingly.

## Tests
`npm test`

