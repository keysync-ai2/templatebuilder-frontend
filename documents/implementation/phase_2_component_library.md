# Phase 2 — Component Library (Left Panel)

**Goal**: Draggable component cards in categorised sections with search.

---

## Step 1: Component Type Definitions

| | Detail |
|---|--------|
| **What** | Define all component types, their metadata, default props, and icons |
| **How** | Create `componentLibrary.js` with `COMPONENT_TYPES` enum and component definitions |
| **Output** | Exportable constants for all component types |
| **Validation** | Import and use in left panel — all types available |

**COMPONENT_TYPES enum:**
```
ROW, COLUMN, TEXT, HEADING, BUTTON, IMAGE, DIVIDER, SPACER, SECTION, TABLE
```

Each component definition includes:
- `type` — enum value
- `label` — display name
- `icon` — Font Awesome icon
- `category` — 'basic' | 'custom' | 'column'
- `defaultProps` — initial property values
- `description` — tooltip text

---

## Step 2: Left Panel Structure

| | Detail |
|---|--------|
| **What** | Build left panel with 3 collapsible sections |
| **How** | Create `email-builder/LeftPanel.js` with accordion sections |
| **Output** | Three sections: Basic Components, Custom Components, Column Layouts |
| **Validation** | Sections expand/collapse. Components display with icons and labels. |

**Section colors:**
- Basic Components: `#F0F7FF` (light blue)
- Custom Components: `#FAF5FF` (light purple)
- Column Components: `#F0FDF4` (light green)

---

## Step 3: Component Cards

| | Detail |
|---|--------|
| **What** | Build draggable component cards with icon, label, and hover states |
| **How** | Create card components with Font Awesome icons |
| **Output** | Cards display in grid within each section |
| **Validation** | Cards show icon + name. Hover shows scale effect and tooltip. |

**Card behaviour:**
- Icon + label layout
- Hover: `scale(1.02)`, subtle shadow increase
- Cursor: `grab` on hover, `grabbing` while dragging

---

## Step 4: Search & Filter

| | Detail |
|---|--------|
| **What** | Add search bar at top of left panel to filter components |
| **How** | Text input with filter logic across all categories |
| **Output** | Typing filters visible component cards |
| **Validation** | Type "button" → only Button component visible |

---

## Step 5: DnD Draggable Sources

| | Detail |
|---|--------|
| **What** | Make each component card draggable using DnD Kit |
| **How** | Wrap cards with `useDraggable()` hook, attach drag data |
| **Output** | Cards can be dragged from library |
| **Validation** | Drag a card → cursor changes, drag overlay appears |

**Drag data payload:**
```javascript
{
  type: 'library-component',
  componentType: COMPONENT_TYPES.TEXT,
  defaultProps: { content: '' }
}
```

---

## Step 6: Drag Overlay

| | Detail |
|---|--------|
| **What** | Show visual preview of dragged component at cursor |
| **How** | DnD Kit `DragOverlay` component with component preview |
| **Output** | Ghost image follows cursor during drag |
| **Validation** | Drag from library → semi-transparent preview visible |

---

## Phase 2 Checkpoint

| Check | Expected |
|-------|----------|
| Left panel visible | 20% width, 3 sections |
| Basic components listed | Text, Heading, Button, Image, Divider, Spacer, Section, Table |
| Column layouts listed | 1-col, 2-col, 3-col, asymmetric, 4-col |
| Search filters components | Typing narrows visible cards |
| Cards are draggable | Drag initiates with 5px threshold |
| Drag overlay visible | Ghost preview follows cursor |
| Sections collapsible | Click header to expand/collapse |
