# Email Template Builder — Drag & Drop Interactions

## DnD Kit Setup

### Sensors

| Sensor | Purpose | Configuration |
|--------|---------|--------------|
| Mouse | Primary desktop interaction | Distance constraint: 5–8px |
| Touch | Tablet support | Press delay: 100–200ms |
| Keyboard | Accessibility | Arrow keys for movement |

### Activation Constraint
- **Distance-based**: Minimum 5–8px drag distance before DnD activates
- **Purpose**: Distinguish click (select) from drag (move)

---

## Drag Sources (Left Panel → Canvas)

### Flow
```
Component Card (Left Panel)
    │ useDraggable() hook
    │
    ├── onDragStart
    │   → Set active drag item
    │   → Show drag overlay (ghost preview)
    │   → Reduce source card opacity to 0.5
    │
    ├── onDragMove
    │   → Update drag overlay position
    │   → Highlight valid drop zones on canvas
    │
    └── onDragEnd
        │
        ├── Valid drop target found
        │   → Dispatch addComponent(component, parentId, position)
        │   → Component added to tree
        │   → Canvas re-renders
        │
        └── No valid target
            → Cancel drag
            → Reset visual state
```

### Drag Data Payload
```javascript
{
  type: 'library-component',    // distinguishes from canvas reorder
  componentType: 'text',        // COMPONENT_TYPES enum value
  defaultProps: { content: '' } // default properties for this type
}
```

---

## Drop Targets (Canvas)

### Target Hierarchy
```
Canvas (root drop zone)
├── Row drop zone (between rows — insert new row)
├── Row
│   ├── Column drop zone (inside column — add component)
│   └── Column
│       ├── Component drop zone (between components — insert)
│       └── Component (leaf — no children accepted)
```

### Collision Detection
- Algorithm: `closestCenter` (DnD Kit built-in)
- Custom modifier: restricts drops to valid containers (columns accept leaf components, canvas accepts rows)

### Drop Zone Highlighting
| State | Visual |
|-------|--------|
| Valid target (hovering) | Light green background + dashed border |
| Invalid target | No change |
| Insertion point | Blue horizontal line between components |

---

## Reordering Within Canvas

### SortableContext
- Each column's children wrapped in `SortableContext`
- Root component array wrapped in `SortableContext`
- Strategy: `verticalListSortingStrategy`

### Flow
```
Component on Canvas
    │ useSortable() hook
    │
    ├── onDragStart
    │   → Identify source component & parent
    │   → Show drag overlay
    │
    ├── onDragOver
    │   → Calculate new position based on pointer
    │   → Show insertion indicator (blue line)
    │
    └── onDragEnd
        → Dispatch moveComponent(componentId, newPosition, newParentId)
        → Component tree updated
        → Canvas re-renders with smooth animation
```

### Cross-Container Moves
- Moving a component from one column to another:
  1. Remove from source column's children
  2. Insert into target column's children at calculated position
  3. Adjust position index if moving within same parent

---

## Drag Overlay

The drag overlay is a visual clone of the dragged component that follows the cursor.

### From Library (new component)
- Shows component type icon + name
- Semi-transparent (opacity 0.8)
- Elevation 3 shadow
- Slightly scaled down (0.9)

### From Canvas (reorder)
- Shows actual component preview
- Semi-transparent (opacity 0.8)
- Original component shows reduced opacity placeholder

---

## Component Tree Mutations

All DnD operations dispatch Redux actions that mutate the component tree:

| Action | Triggered By | Tree Change |
|--------|-------------|-------------|
| `addComponent` | Drop from library | Insert new node at position in parent's children |
| `moveComponent` | Reorder on canvas | Remove from old position, insert at new position |
| `removeComponent` | Delete action | Remove node and all descendants from tree |
| `duplicateComponent` | Duplicate action | Deep clone with new IDs, insert after original |

### Helper Functions
- `findComponentById(tree, id)` — recursive search
- `findParentComponent(tree, childId)` — find parent of a node
- `removeComponentFromTree(tree, id)` — filter out node recursively
- `assignNewIds(component)` — recursively assign new UUIDs (for duplication)

---

## Performance

- Use CSS `transform` for drag overlay positioning (GPU-accelerated)
- Debounce collision detection updates during drag
- Avoid re-rendering entire canvas during drag — only update drop zone indicators
- Use `React.memo` on component cards in library (they don't change during drag)

---

**Summary**: DnD Kit with mouse/touch/keyboard sensors. Library components are draggable sources; canvas columns are drop targets. Reordering uses SortableContext with vertical list strategy. All mutations go through Redux actions. Drag overlay provides visual feedback. Performance optimised with CSS transforms and debounced updates.
