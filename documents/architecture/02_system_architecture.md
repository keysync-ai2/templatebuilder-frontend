# Email Template Builder — System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION SHELL                       │
│                    Next.js 16 (App Router)                    │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                   Redux Store                          │  │
│  │  ┌──────────┐ ┌────────┐ ┌──────────────┐ ┌────────┐ │  │
│  │  │chatSlice │ │uiSlice │ │emailBuilder  │ │template│ │  │
│  │  │          │ │        │ │Slice         │ │Builder │ │  │
│  │  │          │ │        │ │              │ │Slice   │ │  │
│  │  └──────────┘ └────────┘ └──────────────┘ └────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────┐  ┌─────────────────────────────────┐│
│  │  CHATBOT INTERFACE │  │     EMAIL TEMPLATE BUILDER      ││
│  │                    │  │                                  ││
│  │ ┌──────┐ ┌──────┐ │  │ ┌────────┐ ┌──────┐ ┌────────┐ ││
│  │ │Sidebar│ │Chat  │ │  │ │Left    │ │Middle│ │Right   │ ││
│  │ │(hist) │ │Area  │ │  │ │Panel   │ │Panel │ │Panel   │ ││
│  │ └──────┘ │      │ │  │ │(Library│ │(Canvas│ │(Props/ │ ││
│  │          │Widget│ │  │ │)       │ │)      │ │Layers) │ ││
│  │ ┌──────┐ │Render│ │  │ └────────┘ └──────┘ └────────┘ ││
│  │ │Right │ │      │ │  │ ┌──────────────────────────────┐ ││
│  │ │Panel │ └──────┘ │  │ │      Bottom Panel            │ ││
│  │ │(full │ ┌──────┐ │  │ │   (HTML Code Viewer/Editor)  │ ││
│  │ │screen│ │Input │ │  │ └──────────────────────────────┘ ││
│  │ │)     │ └──────┘ │  │                                  ││
│  │ └──────┘          │  │                                  ││
│  └────────────────────┘  └─────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App (layout.js)
└── ReduxProvider
    └── Home (page.js)
        ├── Header
        ├── Sidebar (conversation history)
        ├── ChatArea
        │   └── WidgetRenderer (per message)
        │       ├── ParagraphWidget
        │       ├── TableWidget
        │       ├── BulletsWidget
        │       ├── FormWidget
        │       ├── ImageWidget
        │       └── TemplateBuilderWidget
        │           └── EmailTemplateBuilder
        │               ├── LeftPanel (component library)
        │               ├── MiddlePanel (canvas)
        │               │   └── ComponentRenderer (recursive)
        │               ├── RightPanel (properties + layers)
        │               │   └── ImageGallery
        │               └── BottomPanel (HTML viewer)
        ├── ChatInput
        └── RightPanel (full-screen widget view)
```

## DnD Kit Architecture

```
DndContext (wraps EmailTemplateBuilder)
├── Draggable Sources (Left Panel)
│   ├── Basic Component Cards
│   ├── Custom Component Cards
│   └── Column Layout Cards
│
├── Droppable Targets (Middle Panel)
│   ├── Canvas (root drop zone)
│   ├── Row drop zones
│   └── Column drop zones (nested)
│
└── SortableContext (within canvas)
    └── Sortable items (reorder components)
```

## State Flow

```
User Action
    │
    ▼
React Event Handler
    │
    ▼
Redux Dispatch (action)
    │
    ▼
Reducer (updates state immutably via Immer)
    │
    ▼
Store Update
    │
    ├──→ Canvas Re-render (reads components[])
    ├──→ Properties Panel (reads selectedComponentId + component props)
    ├──→ Layers Panel (reads component tree hierarchy)
    └──→ HTML Viewer (reads components[] → generates HTML)
```

## File Architecture

```
template-builder/
├── app/                    — Next.js App Router
│   ├── layout.js           — Root layout + ReduxProvider
│   └── page.js             — Main page (chatbot entry point)
│
├── components/
│   ├── chat/               — Chatbot components
│   │   ├── ChatArea.js     — Message list + widget rendering
│   │   └── ChatInput.js    — Input bar with attachments
│   │
│   ├── email-builder/      — Email Builder components
│   │   ├── EmailTemplateBuilder.js  — Main builder container
│   │   ├── LeftPanel.js             — Component library
│   │   ├── MiddlePanel.js           — Canvas with DnD
│   │   ├── RightPanel.js            — Properties + layers
│   │   ├── BottomPanel.js           — HTML viewer
│   │   ├── ComponentRenderer.js     — Recursive component renderer
│   │   ├── componentLibrary.js      — Component type definitions
│   │   ├── htmlGenerator.js         — Component tree → HTML converter
│   │   └── ImageGallery.js          — Image management
│   │
│   ├── layout/             — App shell components
│   │   ├── Header.js       — Top navigation bar
│   │   ├── Sidebar.js      — Conversation history
│   │   └── RightPanel.js   — Full-screen widget panel
│   │
│   ├── template-builder/   — Alternative template builder (JSON-based)
│   │   ├── TemplateBuilder.js
│   │   ├── Canvas.js
│   │   ├── LeftPanel.js
│   │   ├── RightPanel.js
│   │   └── TemplateRenderer.js
│   │
│   └── widgets/            — Chat widget components
│       ├── WidgetRenderer.js        — Widget type dispatcher
│       ├── ParagraphWidget.js       — Text display
│       ├── TableWidget.js           — Table display
│       ├── BulletsWidget.js         — List display
│       ├── FormWidget.js            — Interactive form
│       ├── ImageWidget.js           — Image display
│       └── TemplateBuilderWidget.js — Embedded builder
│
├── store/
│   ├── index.js            — Store configuration
│   ├── ReduxProvider.js    — Provider wrapper for App Router
│   └── slices/
│       ├── chatSlice.js           — Conversations & messages
│       ├── uiSlice.js             — UI toggles & active views
│       ├── emailBuilderSlice.js   — Email builder state
│       └── templateBuilderSlice.js — Template builder state
│
├── examples/
│   └── sample-payloads.json — Example widget payloads
│
└── public/                 — Static assets (SVG, favicon, etc.)
```

---

**Summary**: Single-page Next.js app with Redux for state. Two interfaces — chatbot (with widget rendering) and email template builder (four-panel editor with DnD Kit). Components flow: Library → Canvas → Properties → HTML. All state lives in Redux; all rendering is driven by the component tree array.
