# Email Template Builder — State Design

## Redux Store Configuration

```javascript
configureStore({
  reducer: {
    chat: chatReducer,
    ui: uiReducer,
    templateBuilder: templateBuilderReducer,
    emailBuilder: emailBuilderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
```

---

## Slice: `chat`

Manages conversations, messages, and loading state.

### State Shape
```javascript
{
  conversations: [
    {
      id: string,
      title: string,
      messages: [
        {
          id: string,
          role: 'user' | 'assistant',
          text: string,           // for user messages
          widgets: Widget[],      // for assistant messages
          attachments: File[],    // for user messages
          timestamp: string
        }
      ],
      createdAt: string
    }
  ],
  currentConversationId: string | null,
  isLoading: boolean
}
```

### Actions
| Action | Payload | Effect |
|--------|---------|--------|
| `createConversation` | `{ id, title }` | Adds new conversation, sets as current |
| `addMessage` | `{ conversationId, message }` | Appends message to conversation |
| `setLoading` | `boolean` | Sets loading state (typing indicator) |
| `setCurrentConversation` | `conversationId` | Switches active conversation |

### Widget Payload Format
```javascript
{
  type: 'paragraph' | 'table' | 'bullets' | 'form' | 'image' | 'template-builder',
  data: {
    // type-specific fields
    timestamp: string
  }
}
```

---

## Slice: `ui`

Manages UI toggles and active views.

### State Shape
```javascript
{
  sidebarOpen: boolean,
  rightPanelOpen: boolean,
  activeView: 'chat' | 'builder',
  fullScreenWidget: Widget | null
}
```

### Actions
| Action | Payload | Effect |
|--------|---------|--------|
| `toggleSidebar` | — | Toggle sidebar visibility |
| `toggleRightPanel` | — | Toggle right panel visibility |
| `setActiveView` | `'chat' | 'builder'` | Switch main view |
| `setFullScreenWidget` | `Widget | null` | Show widget in full-screen right panel |

---

## Slice: `emailBuilder`

Manages the email template builder state — component tree, selection, zoom.

### State Shape
```javascript
{
  // Template metadata
  templateId: string | null,
  templateName: string,         // default: 'Untitled Template'
  templateSubject: string,
  templateFrom: string,
  templateReplyTo: string,

  // Component tree
  components: Component[],      // root array of rows

  // Selection
  selectedComponentId: string | null,
  hoveredComponentId: string | null,

  // Viewport
  zoomLevel: number,            // default: 100
  devicePreview: 'desktop' | 'tablet' | 'mobile',

  // Editor settings
  showGrid: boolean,            // default: false
  showLayerHints: boolean       // default: true
}
```

### Component Node
```javascript
{
  id: string,            // UUID v4
  type: string,          // COMPONENT_TYPES enum
  props: {               // type-specific properties
    content?: string,
    src?: string,
    href?: string,
    color?: string,
    backgroundColor?: string,
    padding?: number | string,
    margin?: number | string,
    width?: string,
    columns?: number,
    // ... more based on type
  },
  children: Component[], // nested components
  parentId: string | null,
  visibility: boolean,   // default: true
  locked: boolean        // default: false
}
```

### Actions

**Component CRUD:**
| Action | Payload | Effect |
|--------|---------|--------|
| `addComponent` | `{ component, parentId, position }` | Insert component into tree |
| `removeComponent` | `componentId` | Remove from tree, clear selection if selected |
| `updateComponent` | `{ componentId, updates }` | Merge updates into component |
| `moveComponent` | `{ componentId, newPosition, newParentId }` | Remove + re-insert at new location |
| `duplicateComponent` | `componentId` | Deep clone with new IDs, insert after original |
| `replaceComponent` | `{ componentId, newComponent }` | Replace component in-place |

**Selection:**
| Action | Payload | Effect |
|--------|---------|--------|
| `selectComponent` | `componentId | null` | Set selected component |
| `setHoveredComponent` | `componentId | null` | Set hovered component |

**Template:**
| Action | Payload | Effect |
|--------|---------|--------|
| `updateTemplateMeta` | `{ name, subject, from, replyTo }` | Update template metadata |
| `createNewTemplate` | — | Reset to initial state with default row |
| `loadTemplate` | `{ templateName, templateSubject, components, ... }` | Load saved template |

**UI:**
| Action | Payload | Effect |
|--------|---------|--------|
| `setZoomLevel` | `number` | Set canvas zoom (50–150) |
| `setDevicePreview` | `'desktop' | 'tablet' | 'mobile'` | Set preview device |
| `toggleShowGrid` | — | Toggle canvas grid |
| `toggleLayerHints` | — | Toggle layer hint labels |

### Helper Functions (Internal)

| Function | Purpose |
|----------|---------|
| `findComponentById(tree, id)` | Recursive search for component by ID |
| `findParentComponent(tree, childId)` | Find parent of a component |
| `removeComponentFromTree(tree, id)` | Filter out component recursively |
| `assignNewIds(component)` | Recursively assign new UUIDs (for duplication) |
| `createDefaultRow()` | Create a single-column row (initial state) |

---

## Slice: `templateBuilder`

Manages the JSON-based template builder (alternative to email builder).

### State Shape
```javascript
{
  template: {
    name: string,
    description: string,
    id: string,
    createdAt: string,
    data: {
      subject: string,
      body: Row[]
    }
  },
  selectedRowId: string | null,
  selectedColumnId: string | null
}
```

This slice uses the JSON template format from `sample_template.json` — rows with columns, each column having Text/Button type with Style and Actions.

---

## Data Flow Summary

```
User Action (click, drag, type)
    │
    ▼
Event Handler (React component)
    │
    ▼
dispatch(action(payload))
    │
    ▼
Reducer (Immer produces new state)
    │
    ▼
Store updated
    │
    ├──→ useSelector() in Canvas → re-render components
    ├──→ useSelector() in Properties → re-render form
    ├──→ useSelector() in Layers → re-render tree
    └──→ useSelector() in HTML Viewer → re-generate HTML
```

---

**Summary**: 4 Redux slices — `chat` (conversations + messages), `ui` (toggles), `emailBuilder` (component tree + selection + viewport), `templateBuilder` (JSON templates). All component tree mutations use recursive helper functions. State drives all panels — canvas, properties, layers, and HTML viewer.
