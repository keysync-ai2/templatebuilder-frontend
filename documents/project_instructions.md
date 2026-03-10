# Email Template Builder — Project Instructions

## Response Style

- Keep responses **short and simple**. Use plain language.
- After every response, suggest **2–3 follow-up questions** the user might want to ask next.
- When explaining architecture or flow, use analogies and simple terms first.
- If a question is ambiguous, ask a short clarifying question before answering.

### Response Format Example

```
[Short answer in 5–6 sentences]

You might want to ask:
→ "How does [related topic] work?"
→ "What happens when [scenario]?"
→ "Show me the [detail] for this"
```

## What is the Template Builder?

A visual drag-and-drop email template builder embedded in a widget-based chatbot. Users either interact directly with the builder's four-panel interface or ask the chatbot to open it. The builder outputs email-safe HTML using table-based layouts.

## How It Works

1. User opens the chatbot or navigates to the template builder
2. Components are dragged from the left panel library onto the canvas
3. Clicking a component shows its properties in the right panel
4. Editing properties updates the canvas and HTML output in real-time
5. The bottom panel shows generated HTML with syntax highlighting
6. Templates can be saved, loaded, and exported as HTML

## Architecture

- **Framework**: Next.js 16 (App Router, `use client`)
- **Styling**: Tailwind CSS v4 with dark theme
- **State**: Redux Toolkit with 4 slices (`chat`, `ui`, `templateBuilder`, `emailBuilder`)
- **DnD**: @dnd-kit/core + @dnd-kit/sortable
- **Icons**: Font Awesome (solid icons)

## 2 Main Interfaces

### 1. Widget-Based Chatbot
- Dark themed conversational UI
- Left sidebar: conversation history
- Center: chat area with widget rendering
- Right panel: full-screen widget view
- Bottom: chat input with attachment support
- Widgets: paragraph, table, bullets, form, image, template-builder

### 2. Email Template Builder (4-Panel Editor)
- **Left Panel (20%)** — component library with 3 categories: Basic, Custom, Column
- **Middle Panel (60%)** — canvas (600px email width) with DnD drop zones
- **Right Panel (20%)** — properties editor + layers panel + image gallery
- **Bottom Panel (100%)** — HTML code viewer/editor

## Component Library

### Basic Components
- Text/Paragraph
- Heading (H1, H2, H3)
- Button
- Image
- Divider
- Spacer
- Section/Container
- Table

### Column Components
- Single Column (1 col)
- Two Columns (1/2 - 1/2)
- Three Columns (1/3 - 1/3 - 1/3)
- Asymmetric (1/3 - 2/3, 2/3 - 1/3)
- Four Columns (1/4 each)

### Custom Components
- User-created reusable components
- Tag-based organisation
- Search and filter

## Chat Widget Types

| Widget | Props | Purpose |
|--------|-------|---------|
| `paragraph` | `text`, `timestamp` | Text responses |
| `table` | `title`, `columns`, `rows`, `timestamp` | Tabular data |
| `bullets` | `title`, `items`, `ordered`, `timestamp` | Lists |
| `form` | `title`, `fields[]`, `submitLabel`, `timestamp` | Interactive forms |
| `image` | `url`, `alt`, `caption`, `timestamp` | Image display |
| `template-builder` | `title`, `description`, `timestamp` | Embedded template editor |

## State Management

### Redux Store Structure

```
store/
├── slices/
│   ├── chatSlice.js        — conversations, messages, loading state
│   ├── uiSlice.js          — sidebar open, right panel, active view
│   ├── templateBuilderSlice.js — template builder state (JSON template format)
│   └── emailBuilderSlice.js    — email builder component tree, selection, zoom
└── index.js                — store configuration
```

### Email Builder State Shape

```
{
  templateId, templateName, templateSubject, templateFrom, templateReplyTo,
  components: [{ id, type, props, children, parentId, visibility, locked }],
  selectedComponentId, hoveredComponentId,
  zoomLevel, devicePreview,
  showGrid, showLayerHints
}
```

### Email Builder Actions

- `addComponent(component, parentId, position)`
- `removeComponent(componentId)`
- `updateComponent(componentId, updates)`
- `moveComponent(componentId, newPosition, newParentId)`
- `duplicateComponent(componentId)`
- `replaceComponent(componentId, newComponent)`
- `selectComponent(componentId)`
- `setHoveredComponent(componentId)`
- `updateTemplateMeta(name, subject, from, replyTo)`
- `createNewTemplate()` / `loadTemplate(data)`
- `setZoomLevel(level)` / `setDevicePreview(device)`
- `toggleShowGrid()` / `toggleLayerHints()`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (React 19) |
| Styling | Tailwind CSS v4 |
| State | Redux Toolkit + react-redux |
| DnD | @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities |
| Icons | Font Awesome (free-solid-svg-icons) |
| Code Display | react-syntax-highlighter |
| IDs | uuid |
| Screenshot | html2canvas |

## Project Structure

```
template-builder/
├── app/
│   ├── layout.js           — root layout with ReduxProvider
│   └── page.js             — main page (chatbot interface)
├── components/
│   ├── chat/               — ChatArea, ChatInput
│   ├── email-builder/      — LeftPanel, MiddlePanel, RightPanel, BottomPanel,
│   │                         ComponentRenderer, componentLibrary, htmlGenerator,
│   │                         ImageGallery, EmailTemplateBuilder
│   ├── layout/             — Header, Sidebar, RightPanel (chat layout)
│   ├── template-builder/   — Canvas, LeftPanel, RightPanel, TemplateBuilder,
│   │                         TemplateRenderer
│   └── widgets/            — ParagraphWidget, TableWidget, BulletsWidget,
│                             FormWidget, ImageWidget, TemplateBuilderWidget,
│                             WidgetRenderer
├── store/
│   ├── index.js            — Redux store configuration
│   ├── ReduxProvider.js    — Provider wrapper
│   └── slices/             — chatSlice, uiSlice, templateBuilderSlice,
│                             emailBuilderSlice
├── examples/
│   └── sample-payloads.json — Example widget payloads
└── public/                 — Static assets
```

## Key Rules

- **Email HTML = Tables** — all email components render as HTML `<table>` elements, not divs/flexbox
- **600px max width** — standard email body width
- **Inline styles only** — email clients strip `<style>` blocks; all CSS must be inline
- **No height CSS** — use padding/margin for vertical spacing, never explicit height
- **Column widths = percentages** — columns in a row must sum to 100%
- **Nested tables** — components inside columns are sub-tables

## Implementation Phases

1. **Phase 1: Foundation** — Project setup, layout structure, state management
2. **Phase 2: Component Library** — Left panel with draggable components
3. **Phase 3: Canvas & Editor** — Middle panel with DnD drop zones, React rendering
4. **Phase 4: Right Panel** — Properties editor, layers panel, image gallery
5. **Phase 5: Bottom Panel** — HTML code viewer/editor with bidirectional sync
6. **Phase 6: Polish** — Undo/redo, save/load, keyboard shortcuts, performance

---

## Sample Questions You Can Ask

### Understanding the Project
- "What is the Template Builder?"
- "How does the chatbot work?"
- "What widgets are available?"

### Architecture & Flow
- "How does drag-and-drop work?"
- "How is state managed?"
- "How does the component tree work?"

### Components & Panels
- "What components can I drag onto the canvas?"
- "How does the properties panel work?"
- "How does the layers panel work?"
- "How does the HTML viewer work?"

### Email HTML
- "Why tables instead of divs?"
- "How are column widths handled?"
- "How is email-safe HTML generated?"

### Development
- "What phase are we in?"
- "How is the project structured?"
- "What libraries are used?"
