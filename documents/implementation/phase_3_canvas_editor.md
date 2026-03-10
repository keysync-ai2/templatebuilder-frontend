# Phase 3 — Canvas & Editor (Middle Panel)

**Goal**: Working drop zones, recursive component rendering, selection, DnD reordering.

---

## Step 1: Canvas Container

| | Detail |
|---|--------|
| **What** | Create the canvas area — 600px fixed width, centered, scrollable |
| **How** | Build `email-builder/MiddlePanel.js` with canvas container |
| **Output** | White canvas (600px) centered in the middle panel |
| **Validation** | Canvas visible, scrollable, correct width |

**Canvas styles:**
- Width: 600px (email standard)
- Background: white
- Centered in middle panel
- Vertical scroll for long templates
- Subtle border/shadow to indicate canvas bounds

---

## Step 2: DnD Drop Zones

| | Detail |
|---|--------|
| **What** | Make the canvas a valid drop target for library components |
| **How** | Wrap canvas in `DndContext`, set up `useDroppable()` zones |
| **Output** | Dropping a library component onto canvas adds it to the tree |
| **Validation** | Drag text component from library → drop on canvas → component appears |

**Drop zone hierarchy:**
- Canvas root: accepts Row components
- Column containers: accept leaf components (Text, Image, Button, etc.)
- Between-component zones: show insertion indicators

---

## Step 3: ComponentRenderer (Recursive)

| | Detail |
|---|--------|
| **What** | Build recursive renderer that traverses component tree and renders each node |
| **How** | Create `email-builder/ComponentRenderer.js` |
| **Output** | Component tree from Redux renders visually on canvas |
| **Validation** | Add components → they render. Nested components render inside parents. |

**Rendering logic:**
```
for each component in components[]:
  switch (component.type):
    case ROW → render row container with flex layout
    case COLUMN → render column with width from props
    case TEXT → render editable text block
    case IMAGE → render image with src from props
    case BUTTON → render styled button
    ... etc
  if component.children → recurse
```

---

## Step 4: Click-to-Select

| | Detail |
|---|--------|
| **What** | Clicking a component on canvas selects it |
| **How** | onClick handler dispatches `selectComponent(id)` |
| **Output** | Selected component gets blue border, properties panel populates |
| **Validation** | Click component → blue border appears, right panel shows properties |

**Visual indicators:**
- Selected: 2px solid `#2563EB` border
- Hovered: subtle background tint
- Component name tooltip on hover

---

## Step 5: Canvas Reordering (SortableContext)

| | Detail |
|---|--------|
| **What** | Allow reordering components within canvas by dragging |
| **How** | Wrap component lists in `SortableContext` with `verticalListSortingStrategy` |
| **Output** | Drag a component up/down → it moves to new position |
| **Validation** | Drag component within column → reorders. Blue insertion line shows target position. |

---

## Step 6: Nested Component Drops

| | Detail |
|---|--------|
| **What** | Drop components from library into specific columns |
| **How** | Each column acts as a droppable container, collision detection resolves target |
| **Output** | Dragging a text component into a specific column adds it there |
| **Validation** | Two-column row → drop image into right column → image appears in right column only |

---

## Step 7: Device Preview

| | Detail |
|---|--------|
| **What** | Toggle canvas width to simulate desktop/tablet/mobile |
| **How** | Toolbar buttons dispatch `setDevicePreview()` which changes canvas width |
| **Output** | Desktop: 600px, Tablet: 480px, Mobile: 320px |
| **Validation** | Click tablet icon → canvas shrinks to 480px |

---

## Step 8: Zoom Controls

| | Detail |
|---|--------|
| **What** | Allow zooming the canvas in/out |
| **How** | CSS `transform: scale()` on canvas container, controlled by `zoomLevel` state |
| **Output** | Zoom slider: 50% to 150% |
| **Validation** | Set zoom to 75% → canvas visually shrinks |

---

## Phase 3 Checkpoint

| Check | Expected |
|-------|----------|
| Canvas visible | 600px white area centered |
| Drop from library | Drag component → drop on canvas → appears |
| Recursive rendering | Nested components render correctly |
| Click to select | Blue border on selected component |
| Reorder by drag | Components move within canvas |
| Nested drops | Components drop into specific columns |
| Device preview | Desktop/tablet/mobile widths work |
| Zoom | Canvas scales with zoom slider |
