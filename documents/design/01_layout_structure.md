# Email Template Builder — Layout Structure

## Chatbot Layout

```
┌─────────────────────────────────────────────────────────────┐
│                       Header                                 │
│  [Logo]           [Title]              [Settings] [Profile]  │
├──────────┬──────────────────────────────┬───────────────────┤
│          │                              │                   │
│ Sidebar  │         Chat Area            │   Right Panel     │
│ (History)│                              │   (Full-screen    │
│          │  ┌────────────────────────┐  │    widget view)   │
│ [New Chat│  │   Widget Responses     │  │                   │
│  + List] │  │   (tables, forms,      │  │                   │
│          │  │    bullets, images,     │  │                   │
│          │  │    template builder)    │  │                   │
│          │  └────────────────────────┘  │                   │
│          ├──────────────────────────────┤                   │
│          │  [Input] [Attach] [Send]     │                   │
├──────────┴──────────────────────────────┴───────────────────┤
```

- **Header**: Fixed top bar. Logo left, title center, settings/profile right.
- **Sidebar**: Collapsible left panel. Conversation list with new chat button.
- **Chat Area**: Scrollable message list. Each bot message renders widgets via `WidgetRenderer`.
- **Chat Input**: Fixed bottom bar. Text input + attachment + send button.
- **Right Panel**: Expandable panel for full-screen widget view (click expand on any widget).

---

## Email Builder Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    Editor Toolbar                             │
│  [Save] [Preview] [Clear] | [Desktop|Tablet|Mobile] [Zoom]  │
│                           | [Undo] [Redo] [Settings]        │
├──────────────┬────────────────────────┬─────────────────────┤
│              │                        │                     │
│   Left       │    Middle Panel        │     Right           │
│   Panel      │    (Canvas)            │     Panel           │
│   (20%)      │    (60%)               │     (20%)           │
│              │                        │                     │
│ ┌──────────┐ │  ┌──────────────────┐  │ ┌─────────────────┐│
│ │ Basic    │ │  │  ┌────────────┐  │  │ │ Properties      ││
│ │Components│ │  │  │  600px     │  │  │ │ (dynamic form   ││
│ │          │ │  │  │  Canvas    │  │  │ │  based on type)  ││
│ ├──────────┤ │  │  │            │  │  │ ├─────────────────┤│
│ │ Custom   │ │  │  │  Drop Zone │  │  │ │ Layers          ││
│ │Components│ │  │  │            │  │  │ │ (tree view)     ││
│ ├──────────┤ │  │  └────────────┘  │  │ ├─────────────────┤│
│ │ Column   │ │  │                  │  │ │ Image Gallery   ││
│ │ Layouts  │ │  │                  │  │ │ (grid)          ││
│ └──────────┘ │  └──────────────────┘  │ └─────────────────┘│
├──────────────┴────────────────────────┴─────────────────────┤
│                    Bottom Panel (100%)                        │
│  [Scope: Template v] | [Copy] [Download] [Format]            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 1  <!DOCTYPE html>                                      │ │
│  │ 2  <html>                                               │ │
│  │ 3    <body>                                             │ │
│  │ ...  (syntax highlighted HTML)                          │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Panel Sizing

| Panel | Width | Min Width | Resizable |
|-------|-------|-----------|-----------|
| Left Panel | 20% | 200px | Yes (right edge) |
| Middle Panel | 60% | 400px | Flex (takes remaining space) |
| Right Panel | 20% | 200px | Yes (left edge) |
| Bottom Panel | 100% | — | Yes (top edge, 30-40% height) |

---

## Canvas Dimensions (Device Preview)

| Device | Canvas Width | Scale |
|--------|-------------|-------|
| Desktop | 600px | 100% |
| Tablet | 480px | 80% |
| Mobile | 320px | 53% |

---

## Responsive Behaviour

| Breakpoint | Behaviour |
|-----------|-----------|
| 1200px+ | Full 3-column layout + bottom panel |
| 768–1199px | Left panel collapsible sidebar, right panel collapsible |
| < 768px | Single column with tab navigation (not primary focus) |

---

**Summary**: Chatbot uses a sidebar + center + right panel layout. Email builder uses a 3-column (20/60/20) layout with a resizable bottom panel for HTML code. Canvas is fixed at 600px (email standard) and centered in the middle panel. All panels are resizable with minimum widths.
