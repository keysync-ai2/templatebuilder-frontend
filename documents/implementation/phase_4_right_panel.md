# Phase 4 — Right Panel (Properties, Layers, Gallery)

**Goal**: Dynamic property editing, layer tree, image gallery — all synced with canvas.

---

## Step 1: Properties Panel Structure

| | Detail |
|---|--------|
| **What** | Build the properties panel that dynamically renders inputs based on selected component type |
| **How** | Create `email-builder/RightPanel.js` with conditional rendering per type |
| **Output** | Select a Text component → shows text content, font, color inputs. Select a Button → shows button text, URL, colors. |
| **Validation** | Click different component types → properties panel changes accordingly |

**When no component selected:** Show "Select a component to edit its properties" placeholder.

---

## Step 2: Content Property Controls

| | Detail |
|---|--------|
| **What** | Input controls for content-specific properties |
| **How** | Text inputs, textareas, dropdowns for each component type |

**Per component type:**

| Type | Content Properties |
|------|-------------------|
| Text | content (textarea), font family, font size, font weight, text align, text color |
| Heading | content, heading level (H1/H2/H3), font, color |
| Button | button text, link URL, background color, text color, border radius |
| Image | image src, alt text, width, height, border radius |
| Divider | color, thickness, style (solid/dashed/dotted) |
| Spacer | height (px) |
| Table | columns, rows (editable grid) |
| Row | number of columns |
| Column | width (%) |

---

## Step 3: Styling Property Controls

| | Detail |
|---|--------|
| **What** | Controls for visual styling applicable to all components |
| **How** | Shared styling section with padding, margin, background, border controls |

**Controls:**
- Background color (color picker)
- Padding: top, right, bottom, left (number inputs or unified)
- Margin: top, right, bottom, left
- Border: color, width, style, radius
- Box shadow: offset, blur, color
- Opacity: range slider (0–1)

---

## Step 4: Real-Time Property Updates

| | Detail |
|---|--------|
| **What** | Property changes immediately update the canvas |
| **How** | onChange handlers dispatch `updateComponent(componentId, updates)` |
| **Output** | Change background color → canvas component updates instantly |
| **Validation** | Edit text content → canvas text changes. Edit padding → spacing updates. |

**Performance:** Debounce text input updates (150ms) to prevent excessive re-renders.

---

## Step 5: Layers Panel

| | Detail |
|---|--------|
| **What** | Tree view showing component hierarchy, synced with canvas selection |
| **How** | Recursive tree renderer that reads component tree from Redux |
| **Output** | Collapsible tree: Row → Column → Components |
| **Validation** | Click layer → selects on canvas. Select on canvas → highlights in layers. |

**Layer item features:**
- Component type icon (Font Awesome)
- Component label (type name or custom label)
- Indentation for nesting depth
- Eye icon: toggle `visibility`
- Lock icon: toggle `locked`
- Click: dispatch `selectComponent(id)`

---

## Step 6: Layer Selection Sync

| | Detail |
|---|--------|
| **What** | Selection syncs between canvas and layers panel |
| **How** | Both read `selectedComponentId` from Redux |
| **Output** | Click on canvas → layer highlights. Click layer → canvas component selected. |
| **Validation** | Bidirectional selection works without flicker |

---

## Step 7: Visibility & Lock Toggles

| | Detail |
|---|--------|
| **What** | Toggle component visibility and lock status from layers |
| **How** | Dispatch `updateComponent(id, { visibility: false })` or `{ locked: true }` |
| **Output** | Hidden components don't render on canvas. Locked components can't be edited/moved. |
| **Validation** | Toggle eye → component disappears from canvas. Toggle lock → can't drag or edit. |

---

## Step 8: Image Gallery

| | Detail |
|---|--------|
| **What** | Image management: upload, browse, insert into canvas |
| **How** | Create `email-builder/ImageGallery.js` |
| **Output** | Grid of uploaded images. Click to insert into selected image component. |
| **Validation** | Upload image → appears in gallery. Click → inserts into selected image component's src. |

**Features:**
- Upload via file picker or drag-and-drop
- Grid thumbnails (3–4 columns)
- Hover: show actions (insert, delete, copy URL)
- Image metadata: filename, dimensions, size

---

## Phase 4 Checkpoint

| Check | Expected |
|-------|----------|
| Properties panel visible | 20% width right panel |
| Dynamic properties | Different inputs per component type |
| Content editing | Text, colors, fonts, URLs editable |
| Styling editing | Padding, margin, background, border |
| Real-time updates | Changes reflect on canvas immediately |
| Layers panel | Tree view of component hierarchy |
| Selection sync | Click layer ↔ click canvas = same selection |
| Visibility toggle | Eye icon hides/shows component |
| Lock toggle | Lock icon prevents editing |
| Image gallery | Upload, browse, insert images |
