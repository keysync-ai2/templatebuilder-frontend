# Email Template Builder — Project Flow

## User Interaction Flow

```
User
  │
  ├── Option A: Chatbot Interface
  │     │
  │     ▼
  │   Type message (e.g., "build me an email template")
  │     │
  │     ▼
  │   Bot generates widget response
  │     │
  │     ▼
  │   WidgetRenderer renders appropriate widget
  │     │
  │     ▼
  │   TemplateBuilderWidget opens → Full Email Builder
  │
  └── Option B: Direct Email Builder
        │
        ▼
      Four-Panel Editor
        │
        ├── Left Panel: Drag component from library
        │     │
        │     ▼
        ├── Middle Panel: Drop on canvas → component added to tree
        │     │
        │     ▼
        ├── Right Panel: Edit properties → updates component in state
        │     │
        │     ▼
        └── Bottom Panel: View/edit generated HTML
```

## Step-by-Step Flow: Drag & Drop

1. **User drags component** — from Left Panel component library (Basic, Custom, or Column)
2. **DnD Kit activates** — mouse sensor detects drag start (5-8px threshold), creates drag overlay
3. **Canvas shows drop zones** — collision detection highlights valid drop targets
4. **User drops component** — `onDragEnd` handler fires
5. **Redux dispatch** — `addComponent` action adds new component to state tree with `parentId` and `position`
6. **Canvas re-renders** — `ComponentRenderer` traverses updated tree, renders each component
7. **HTML updates** — `htmlGenerator` converts component tree to email-safe HTML
8. **Bottom panel reflects** — HTML code viewer shows updated output

## Step-by-Step Flow: Property Editing

1. **User clicks component** on canvas
2. **`selectComponent` dispatched** — sets `selectedComponentId` in Redux
3. **Right Panel populates** — reads selected component's `type` and `props`, renders matching input controls
4. **User changes a property** (e.g., background color)
5. **`updateComponent` dispatched** — merges updates into component in state tree
6. **Canvas re-renders** — component reflects new property value
7. **HTML updates** — bottom panel shows updated code

## Step-by-Step Flow: Chatbot Widget

1. **User sends message** — e.g., "show me a table" or "open template builder"
2. **`addMessage` dispatched** — user message added to conversation
3. **Bot response generated** — `generateBotResponse()` returns widget payload array
4. **`addMessage` dispatched** — bot message with `widgets[]` added to conversation
5. **`WidgetRenderer` renders** — iterates over widgets, renders matching widget component
6. **Widget interaction** — user interacts with rendered widget (fill form, view table, use builder)

## Component Tree Structure

```
components[] (root array)
├── Row { type: 'row', columns: 2 }
│   ├── Column { type: 'column', width: '50%' }
│   │   ├── Text { type: 'text', content: '...' }
│   │   └── Button { type: 'button', text: '...' }
│   └── Column { type: 'column', width: '50%' }
│       └── Image { type: 'image', src: '...' }
├── Row { type: 'row', columns: 1 }
│   └── Column { type: 'column', width: '100%' }
│       └── Divider { type: 'divider' }
└── Row { type: 'row', columns: 1 }
    └── Column { type: 'column', width: '100%' }
        └── Text { type: 'text', content: '...' }
```

## Key Design Principles

- **Table-based layout** — all email components render as HTML tables for cross-client compatibility
- **Component tree** — nested array in Redux, traversed recursively for rendering and HTML generation
- **Real-time sync** — canvas, properties panel, and HTML viewer all reflect the same state
- **Widget-based chat** — structured JSON payloads drive widget rendering, not raw text

---

**Summary**: User drags components from library → drops on canvas → edits properties → views HTML output. All changes flow through Redux state. The chatbot can also launch the builder as an embedded widget. Component tree is a nested array where rows contain columns, and columns contain leaf components.
