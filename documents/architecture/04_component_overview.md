# Email Template Builder — Component Overview

## Two Main Interfaces

### 1. Widget-Based Chatbot

The chatbot is a dark-themed conversational interface where the AI responds with structured widgets instead of plain text.

**Components:**
- **Header** (`layout/Header.js`) — logo, profile, settings, theme toggle
- **Sidebar** (`layout/Sidebar.js`) — conversation history, new chat button
- **ChatArea** (`chat/ChatArea.js`) — message list, renders user messages and bot widget responses
- **ChatInput** (`chat/ChatInput.js`) — text input, attachment button, send button
- **RightPanel** (`layout/RightPanel.js`) — full-screen view for any widget (expand button)

**Widget System:**
- **WidgetRenderer** (`widgets/WidgetRenderer.js`) — dispatches to the correct widget based on `type`
- Widgets receive a `data` prop with type-specific content

### 2. Email Template Builder

The builder is a four-panel visual editor for creating email templates.

**Container:** `EmailTemplateBuilder.js` — wraps all panels in a DndContext

---

## Chatbot Widgets

### ParagraphWidget
- Renders formatted text
- Props: `text`, `timestamp`

### TableWidget
- Renders data in a styled table
- Props: `title`, `columns[]`, `rows[][]`, `timestamp`

### BulletsWidget
- Renders ordered or unordered lists
- Props: `title`, `items[]`, `ordered`, `timestamp`

### FormWidget
- Renders interactive form with field types: `text`, `email`, `select`, `textarea`
- Props: `title`, `fields[]`, `submitLabel`, `timestamp`
- Each field: `name`, `label`, `type`, `placeholder`, `required`, `options[]`

### ImageWidget
- Renders an image with caption
- Props: `url`, `alt`, `caption`, `timestamp`

### TemplateBuilderWidget
- Embeds the full email template builder inside the chat
- Props: `title`, `description`, `timestamp`
- Renders `EmailTemplateBuilder` component

---

## Email Builder Panels

### Left Panel — Component Library

Three categories of draggable components:

**Basic Components:**
| Component | Type Constant | Default Props |
|-----------|--------------|---------------|
| Text | `COMPONENT_TYPES.TEXT` | `content: ''` |
| Heading | `COMPONENT_TYPES.HEADING` | `content: '', level: 'h1'` |
| Button | `COMPONENT_TYPES.BUTTON` | `text: '', href: ''` |
| Image | `COMPONENT_TYPES.IMAGE` | `src: '', alt: ''` |
| Divider | `COMPONENT_TYPES.DIVIDER` | `color: '#ccc'` |
| Spacer | `COMPONENT_TYPES.SPACER` | `height: 20` |
| Section | `COMPONENT_TYPES.SECTION` | container |
| Table | `COMPONENT_TYPES.TABLE` | `columns[], rows[]` |

**Column Components:**
| Layout | Columns | Widths |
|--------|---------|--------|
| Single | 1 | 100% |
| Two Equal | 2 | 50% / 50% |
| Three Equal | 3 | 33.33% each |
| Left Heavy | 2 | 66.67% / 33.33% |
| Right Heavy | 2 | 33.33% / 66.67% |
| Four Equal | 4 | 25% each |

**Custom Components:** User-created, saved for reuse.

### Middle Panel — Canvas

- Fixed 600px width (email standard)
- Receives dropped components from left panel
- Renders component tree recursively via `ComponentRenderer`
- Click to select, hover to highlight
- DnD reordering within canvas
- Device preview modes: desktop (600px), tablet (480px), mobile (320px)
- Zoom controls: 50% – 150%

### Right Panel — Properties + Layers

**Properties Panel (top half):**
- Dynamic form based on selected component type
- Content properties: text, src, href, colors, fonts
- Styling properties: padding, margin, background, border, shadow
- Advanced: custom CSS classes, attributes

**Layers Panel (bottom half):**
- Tree view of component hierarchy
- Click to select (synced with canvas)
- Visibility toggle (eye icon)
- Lock toggle (lock icon)
- Drag to reorder

**Image Gallery:**
- Upload, browse, and insert images
- Grid thumbnails with hover actions
- Drag from gallery to canvas

### Bottom Panel — HTML Viewer

- Shows generated email HTML
- Syntax highlighting (react-syntax-highlighter)
- Scope selector: full template vs selected component
- Copy to clipboard, download HTML
- Editable mode with bidirectional sync (code changes update canvas)

---

## Component Tree Model

Every email component in the builder is a node in a tree:

```javascript
{
  id: string,          // UUID v4
  type: string,        // from COMPONENT_TYPES enum
  props: {},           // type-specific properties
  children: [],        // nested components (for rows/columns/sections)
  parentId: string,    // parent component ID (null for root)
  visibility: boolean, // show/hide in canvas
  locked: boolean      // prevent editing
}
```

**Tree rules:**
- Root array contains `Row` components
- Each `Row` contains 1+ `Column` children
- Each `Column` contains 0+ leaf components (Text, Image, Button, etc.)
- Leaf components have no children
- Sections can contain nested rows

---

**Summary**: Two interfaces — chatbot with 6 widget types, and a 4-panel email builder. The builder uses a recursive component tree (Rows → Columns → Leaf components). Left panel is the source, canvas is the target, right panel edits properties, bottom panel shows HTML. Everything syncs through Redux.
