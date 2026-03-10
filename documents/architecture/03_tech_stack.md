# Email Template Builder — Tech Stack

## Frontend Framework

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | Next.js 16 (App Router) | React SSR + client-side rendering |
| React | React 19.2 | UI component library |
| Styling | Tailwind CSS v4 | Utility-first CSS framework |
| PostCSS | @tailwindcss/postcss v4 | CSS processing |
| Linting | ESLint + eslint-config-next | Code quality |

## State Management

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Store | Redux Toolkit (RTK) | Centralised state management |
| Bindings | react-redux v9 | React-Redux integration |
| Middleware | RTK default (Immer + thunk) | Immutable updates + async actions |

## Drag & Drop

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Core | @dnd-kit/core v6 | DnD context, sensors, collision detection |
| Sortable | @dnd-kit/sortable v10 | List reordering within canvas |
| Utilities | @dnd-kit/utilities v3 | CSS transform helpers |

## UI Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Icons | @fortawesome/react-fontawesome v3 | Icon rendering |
| Icon Set | @fortawesome/free-solid-svg-icons v7 | Solid icon library |
| Icon Core | @fortawesome/fontawesome-svg-core v7 | Font Awesome engine |
| Code Display | react-syntax-highlighter v16 | HTML syntax highlighting in bottom panel |
| Screenshot | html2canvas v1 | Template thumbnail generation |

## Utilities

| Component | Technology | Purpose |
|-----------|-----------|---------|
| IDs | uuid v13 | Unique component IDs (v4) |

## Key Versions

| Dependency | Version |
|-----------|---------|
| Next.js | 16.0.1 |
| React | 19.2.0 |
| Tailwind CSS | 4.x |
| @reduxjs/toolkit | 2.10.1 |
| @dnd-kit/core | 6.3.1 |
| @dnd-kit/sortable | 10.0.0 |
| Node.js | 18+ |

## Build & Dev

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (Next.js) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

**Summary**: Next.js 16 + React 19 + Tailwind CSS v4 for the app. Redux Toolkit for state. DnD Kit for drag-and-drop. Font Awesome for icons. react-syntax-highlighter for code display. uuid for component IDs. All client-side — no backend dependencies yet.
