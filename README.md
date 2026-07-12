# KNOWLEDGE

A local React/Vite study library for the HTML knowledge pages and raw lecture scripts in this repository.

## Project Structure

- `src/` - React application, content ingestion, progress storage, and styles.
- `Knowledge/` - Source HTML study pages loaded by the app.
- `RawScripts/` - Original markdown transcript/script material.
- `index.html` - Vite app entry point.

## Setup

```sh
npm install
npm run dev
```

The dev server runs on `127.0.0.1` by default.

## Build

```sh
npm run build
```

The production bundle is generated into `dist/`, which is intentionally ignored by Git.
