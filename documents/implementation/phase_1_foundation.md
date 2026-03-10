# Phase 1 — Foundation

**Goal**: Project scaffolding, chatbot interface, widget system, state management.

---

## Step 1: Project Initialisation

| | Detail |
|---|--------|
| **What** | Create Next.js 16 project with Tailwind CSS v4 |
| **How** | `npx create-next-app@latest template-builder` |
| **Output** | Working dev server at `localhost:3000` |
| **Validation** | `npm run dev` starts without errors |

---

## Step 2: Install Dependencies

| | Detail |
|---|--------|
| **What** | Install all required packages |
| **How** | `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @reduxjs/toolkit react-redux @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome react-syntax-highlighter uuid html2canvas` |
| **Output** | All dependencies in `package.json` |
| **Validation** | `npm run build` succeeds |

---

## Step 3: Redux Store Setup

| | Detail |
|---|--------|
| **What** | Create Redux store with 4 slices |
| **How** | Create `store/index.js`, `store/ReduxProvider.js`, and 4 slice files |
| **Output** | Store with `chat`, `ui`, `templateBuilder`, `emailBuilder` reducers |
| **Validation** | Redux DevTools shows all 4 slices with initial state |

**Files created:**
- `store/index.js` — `configureStore` with all reducers
- `store/ReduxProvider.js` — `Provider` wrapper for Next.js App Router (`'use client'`)
- `store/slices/chatSlice.js` — conversations, messages, loading
- `store/slices/uiSlice.js` — sidebar, right panel, active view
- `store/slices/emailBuilderSlice.js` — component tree, selection, zoom
- `store/slices/templateBuilderSlice.js` — JSON-based template state

**Wire into app:**
- `app/layout.js` wraps children in `<ReduxProvider>`

---

## Step 4: Chatbot Layout Shell

| | Detail |
|---|--------|
| **What** | Build the chatbot UI shell: Header, Sidebar, ChatArea, ChatInput, RightPanel |
| **How** | Create components in `components/layout/` and `components/chat/` |
| **Output** | Dark-themed chatbot interface with sidebar, chat area, and input |
| **Validation** | Visual layout matches design. Sidebar shows conversation list. Input accepts text. |

**Components:**
- `components/layout/Header.js` — logo, title, settings, profile
- `components/layout/Sidebar.js` — conversation list, new chat button
- `components/layout/RightPanel.js` — full-screen widget view (toggleable)
- `components/chat/ChatArea.js` — scrollable message list
- `components/chat/ChatInput.js` — text input, attachment button, send button
- `app/page.js` — assembles all components, handles `onSend`

---

## Step 5: Widget System

| | Detail |
|---|--------|
| **What** | Build the widget rendering system and all 6 widget components |
| **How** | Create `WidgetRenderer` + individual widget components |
| **Output** | Bot messages render as structured widgets based on `type` field |
| **Validation** | Type "show me a table" → table widget renders. Type "form" → form renders. |

**Components:**
- `components/widgets/WidgetRenderer.js` — switch on `widget.type`, render matching component
- `components/widgets/ParagraphWidget.js` — text display
- `components/widgets/TableWidget.js` — table with columns and rows
- `components/widgets/BulletsWidget.js` — ordered/unordered list
- `components/widgets/FormWidget.js` — interactive form with field types
- `components/widgets/ImageWidget.js` — image with caption
- `components/widgets/TemplateBuilderWidget.js` — embedded email builder

---

## Step 6: Bot Response Generator

| | Detail |
|---|--------|
| **What** | Implement keyword-based response generation for testing |
| **How** | `generateBotResponse()` function in `page.js` |
| **Output** | Bot responds with appropriate widgets based on user input keywords |
| **Validation** | Each keyword trigger returns correct widget type |

**Keyword mapping:**
- `table` / `data` → paragraph + table widget
- `list` / `bullet` → bullets widget
- `form` → paragraph + form widget
- `image` → paragraph + image widget
- `template` / `email builder` → paragraph + template builder widget
- default → help text paragraph

---

## Phase 1 Checkpoint

| Check | Expected |
|-------|----------|
| Dev server runs | `npm run dev` → localhost:3000 |
| Dark theme chatbot visible | Header, sidebar, chat area, input bar |
| Send message | User message appears in chat |
| Bot responds with widgets | Keyword-based widget responses render |
| Table widget | Styled table with columns and rows |
| Form widget | Interactive form with fields |
| Bullets widget | Ordered/unordered list |
| Image widget | Image with caption |
| Template builder widget | Embedded builder opens |
| Redux store | All 4 slices initialised |
| Conversation history | Sidebar shows conversations |
