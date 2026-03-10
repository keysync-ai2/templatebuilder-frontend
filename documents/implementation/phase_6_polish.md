# Phase 6 — Polish & Enhancement

**Goal**: Production-quality UX — undo/redo, save/load, keyboard shortcuts, performance, accessibility.

---

## Step 1: Undo/Redo

| | Detail |
|---|--------|
| **What** | Track state history and allow undo/redo |
| **How** | State history stack (snapshots of `emailBuilder` state). Custom middleware or Redux Undo. |
| **Output** | Ctrl+Z → undo last change. Ctrl+Shift+Z → redo. |
| **Validation** | Add component → undo → component removed. Redo → component returns. |

**Implementation:**
- History array of state snapshots
- `historyIndex` pointer
- Max history: 50 entries (prevent memory bloat)
- Clear future history on new action

---

## Step 2: Save/Load Templates

| | Detail |
|---|--------|
| **What** | Persist templates to localStorage (or API later) |
| **How** | Serialize `emailBuilder` state to JSON. Load via `loadTemplate()` action. |
| **Output** | Save → template persists across browser sessions. Load → restores template. |
| **Validation** | Save template → refresh page → load → template restored exactly |

**Save format:**
```json
{
  "templateName": "...",
  "templateSubject": "...",
  "components": [...],
  "savedAt": "ISO timestamp"
}
```

---

## Step 3: Template Export

| | Detail |
|---|--------|
| **What** | Export complete email HTML file |
| **How** | Generate full HTML document with doctype, head, meta tags, inline styles |
| **Output** | Downloadable .html file that works in email clients |
| **Validation** | Download HTML → open in browser → looks correct. Send via email → renders properly. |

---

## Step 4: Keyboard Shortcuts

| | Detail |
|---|--------|
| **What** | Power-user keyboard shortcuts |
| **How** | Global key event listener with shortcut map |

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Delete` / `Backspace` | Remove selected component |
| `Ctrl+D` | Duplicate selected component |
| `Ctrl+C` | Copy component |
| `Ctrl+V` | Paste component |
| `Escape` | Deselect |
| `Ctrl+S` | Save template |
| `↑` / `↓` | Navigate between components |

---

## Step 5: Context Menus

| | Detail |
|---|--------|
| **What** | Right-click context menu on canvas components |
| **How** | Custom context menu component with position tracking |
| **Output** | Right-click → menu with: Copy, Duplicate, Delete, Move Up, Move Down |
| **Validation** | Right-click component → menu appears. Click "Duplicate" → component cloned. |

---

## Step 6: Performance Optimisation

| | Detail |
|---|--------|
| **What** | Ensure smooth UX even with large templates |
| **How** | React.memo, useMemo, useCallback, debounce |

**Optimisations:**
- `React.memo` on ComponentRenderer children
- `useMemo` on HTML generation (recompute only when tree changes)
- `useCallback` on event handlers passed to child components
- Debounce property input updates (150ms)
- Virtual scrolling for large component libraries
- CSS transforms for DnD animations (GPU-accelerated)

---

## Step 7: Accessibility

| | Detail |
|---|--------|
| **What** | Keyboard navigation, ARIA labels, focus indicators |
| **How** | Semantic HTML, aria-labels, focus-visible styles |

**Requirements:**
- Tab through all interactive elements
- Focus indicators (blue outline) on all focusable elements
- ARIA labels on buttons, inputs, panels
- Landmark roles: navigation, main, complementary
- Screen reader announcements for state changes
- Colour contrast: WCAG AA (4.5:1 for text)

---

## Step 8: Testing

| | Detail |
|---|--------|
| **What** | Unit tests, integration tests, E2E tests |

**Test coverage:**
- Unit: Redux reducers (add/remove/move/duplicate component)
- Unit: HTML generator (tree → HTML conversion)
- Unit: Helper functions (findComponentById, removeComponentFromTree)
- Integration: DnD flow (drag from library → drop on canvas → component in tree)
- E2E: Full workflow (add components, edit properties, export HTML)

---

## Phase 6 Checkpoint

| Check | Expected |
|-------|----------|
| Undo/Redo | Ctrl+Z / Ctrl+Shift+Z work |
| Save template | Persists to localStorage |
| Load template | Restores from localStorage |
| Export HTML | Downloads valid .html file |
| Keyboard shortcuts | Delete, duplicate, copy/paste work |
| Context menu | Right-click shows actions |
| Performance | Smooth with 50+ components |
| Accessibility | Tab navigation, ARIA labels, focus indicators |
| Tests passing | Unit + integration tests green |
