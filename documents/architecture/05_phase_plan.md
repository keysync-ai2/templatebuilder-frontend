# Email Template Builder — Phase Plan

## Implementation Phases

### Phase 1: Foundation
**Goal**: Project scaffolding, layout shell, state management wired up.

| Step | Task | Output |
|------|------|--------|
| 1 | Initialize Next.js project with Tailwind CSS | Working dev server |
| 2 | Install dependencies (DnD Kit, Redux, Font Awesome, etc.) | package.json configured |
| 3 | Create main layout with three-panel + bottom panel structure | Visual shell |
| 4 | Set up Redux store with 4 slices | State management working |
| 5 | Build chatbot shell (Header, Sidebar, ChatArea, ChatInput) | Chatbot UI functional |
| 6 | Implement widget system (WidgetRenderer + all 6 widgets) | Widgets render from JSON |

**Checkpoint**: Chatbot renders structured widget responses. Layout shell visible.

---

### Phase 2: Component Library (Left Panel)
**Goal**: Draggable component cards in categorised sections.

| Step | Task | Output |
|------|------|--------|
| 1 | Define component types and metadata (componentLibrary.js) | Type enum + defaults |
| 2 | Build component cards with icons and labels | Visual component list |
| 3 | Implement 3 categories: Basic, Custom, Columns | Accordion sections |
| 4 | Add search/filter functionality | Filter components by name |
| 5 | Set up DnD Kit draggable sources on each card | Cards are draggable |
| 6 | Create drag overlay (ghost preview) | Visual drag feedback |

**Checkpoint**: Components are draggable from left panel with visual feedback.

---

### Phase 3: Canvas & Editor (Middle Panel)
**Goal**: Working drop zones, component rendering, selection.

| Step | Task | Output |
|------|------|--------|
| 1 | Create canvas container (600px width, centered, scrollable) | Email-width canvas |
| 2 | Implement DnD Kit drop zones on canvas | Components droppable |
| 3 | Build ComponentRenderer (recursive tree rendering) | Components display on canvas |
| 4 | Implement click-to-select with selection border | Selection works |
| 5 | Add DnD reordering within canvas (SortableContext) | Reorder by drag |
| 6 | Implement nested drops (components into columns) | Nested DnD |
| 7 | Add device preview modes (desktop/tablet/mobile widths) | Responsive preview |
| 8 | Add zoom controls | Canvas zoom |

**Checkpoint**: Full DnD workflow — drag from library, drop on canvas, reorder, select.

---

### Phase 4: Right Panel
**Goal**: Property editing, layer management, image gallery.

| Step | Task | Output |
|------|------|--------|
| 1 | Build dynamic properties panel (renders inputs based on component type) | Property editing |
| 2 | Implement content property controls (text, color, font, alignment) | Content editable |
| 3 | Implement styling property controls (padding, margin, background, border) | Styling editable |
| 4 | Wire property changes to Redux (updateComponent) | Real-time canvas updates |
| 5 | Build layers panel (tree view of component hierarchy) | Layer tree visible |
| 6 | Implement layer selection sync with canvas | Click layer → selects on canvas |
| 7 | Add visibility/lock toggles on layers | Eye/lock icons work |
| 8 | Build image gallery (upload, browse, insert) | Image management |

**Checkpoint**: Select component → edit properties → see changes on canvas and in layers.

---

### Phase 5: Bottom Panel
**Goal**: HTML code viewer with syntax highlighting, bidirectional sync.

| Step | Task | Output |
|------|------|--------|
| 1 | Build htmlGenerator.js (component tree → email HTML) | HTML generation |
| 2 | Render HTML with syntax highlighting (react-syntax-highlighter) | Highlighted code |
| 3 | Add scope selector (full template vs selected component) | Scope toggle |
| 4 | Add copy-to-clipboard and download buttons | Export actions |
| 5 | Implement editable mode (code editor) | Code editing |
| 6 | Implement bidirectional sync (code changes → canvas updates) | Two-way sync |
| 7 | Add resizable divider between canvas and code panel | Panel resizing |

**Checkpoint**: HTML output visible, copyable, downloadable. Edits in code reflect on canvas.

---

### Phase 6: Polish & Enhancement
**Goal**: Production-quality UX, performance, keyboard shortcuts.

| Step | Task | Output |
|------|------|--------|
| 1 | Implement undo/redo (state history stack) | Ctrl+Z / Ctrl+Shift+Z |
| 2 | Save/load templates (localStorage or API) | Template persistence |
| 3 | Template export (full HTML download) | Export feature |
| 4 | Keyboard shortcuts (delete, duplicate, copy/paste) | Power user support |
| 5 | Context menus (right-click on components) | Quick actions |
| 6 | Performance: React.memo, debounced updates, virtualization | Smooth UX |
| 7 | Accessibility: keyboard nav, ARIA labels, focus indicators | A11y compliance |
| 8 | Testing: unit tests, DnD integration tests | Test coverage |

**Checkpoint**: Production-ready builder with undo/redo, save/load, keyboard shortcuts, and good performance.

---

## Current Status

| Phase | Status |
|-------|--------|
| Phase 1: Foundation | Completed |
| Phase 2: Component Library | In Progress |
| Phase 3: Canvas & Editor | In Progress |
| Phase 4: Right Panel | In Progress |
| Phase 5: Bottom Panel | In Progress |
| Phase 6: Polish | Not Started |

---

**Summary**: 6 phases from scaffolding to polish. Phase 1 (foundation + chatbot) is complete. Phases 2–5 (builder panels) are in progress. Phase 6 (polish) is future work.
