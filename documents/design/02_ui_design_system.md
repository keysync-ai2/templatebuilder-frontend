# Email Template Builder — UI Design System

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Brand Blue | `#2563EB` | Selection borders, focus states, primary actions |
| White | `#FFFFFF` | Canvas background, surfaces |
| Light Gray | `#F9FAFB` | Secondary backgrounds (right panel) |
| Medium Gray | `#D1D5DB` | Borders, dividers |
| Dark Gray | `#4B5563` | Body text |
| Dark Background | `#0a0a0a` (gray-950) | Chatbot background |

### Semantic Colors
| Name | Hex | Usage |
|------|-----|-------|
| Success Green | `#10B981` | Validation, successful actions |
| Error Red | `#EF4444` | Errors, deletions |
| Warning Yellow | `#F59E0B` | Warnings |
| Info Blue | `#3B82F6` | Information |

### Component Category Colors
| Category | Background | Usage |
|----------|-----------|-------|
| Basic Components | `#F0F7FF` (light blue) | Left panel section |
| Custom Components | `#FAF5FF` (light purple) | Left panel section |
| Column Components | `#F0FDF4` (light green) | Left panel section |

### Interactive States
| State | Color | Usage |
|-------|-------|-------|
| Hover | `#F0F7FF` (light blue tint) | Component card hover |
| Drag | `#F0FDF4` (light green tint) | Drag-over state |
| Disabled | `#E5E7EB` (light gray) | Disabled controls |
| Selected | `#2563EB` border | Selected component |

---

## Typography

### Font Stack
- **Primary**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Monospace (Code)**: `"Monaco", "Courier New", Courier, monospace`
- **Email Canvas**: `Arial, Helvetica, sans-serif` (email-safe)

### Text Hierarchy
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 24px | Bold | 1.3 |
| H2/H3 | 18px | Semi-bold | 1.4 |
| Body | 14px | Regular | 1.5 |
| Labels | 12px | Medium | 1.4 |
| Code | 13px | Regular | 1.6 |

---

## Spacing System

- **Base unit**: 4px
- **Scale**: 4, 8, 12, 16, 24, 32, 48, 64px
- **Component padding**: 12–16px (internal)
- **Section margin**: 16–24px (between sections)
- **Panel gap**: 8px (between left/middle/right)

---

## Elevation & Shadows

| Level | Shadow | Usage |
|-------|--------|-------|
| 0 | None (borders only) | Flat elements |
| 1 | `0 1px 2px rgba(0,0,0,0.05)` | Cards, panels |
| 2 | `0 4px 6px rgba(0,0,0,0.1)` | Hover state, emphasis |
| 3 | `0 10px 15px rgba(0,0,0,0.15)` | Modals, overlays, drag overlay |

---

## Border Radius

| Size | Value | Usage |
|------|-------|-------|
| Tight | 2px | Small controls |
| Medium | 4px | Buttons, inputs, cards |
| Large | 8px | Panels, containers |
| Full | 50% | Avatars, badges |

---

## Interactive Components

### Buttons
| State | Style |
|-------|-------|
| Default | Solid background, white text |
| Hover | Slightly darker bg, scale 1.02 |
| Active | Darker bg, inset shadow |
| Disabled | Opacity 0.5, cursor not-allowed |

| Size | Height | Horizontal Padding |
|------|--------|-------------------|
| Small | 28–32px | 12px |
| Medium | 36–40px | 16px |
| Large | 44–48px | 20px |

### Input Fields
| State | Style |
|-------|-------|
| Default | Light gray border, white bg |
| Focus | Blue border (2px), subtle glow |
| Error | Red border, error message below |
| Disabled | Light gray bg, reduced opacity |

### Drag & Drop
| State | Visual |
|-------|--------|
| Dragging | Opacity 0.5, cursor grab |
| Drag overlay | Semi-transparent ghost (0.8 opacity), elevation 3 |
| Drop zone active | Light green tint, dashed border |
| Invalid drop | No visual change (rejection) |

---

## Animations

| Type | Duration | Easing |
|------|----------|--------|
| Hover states | 100–150ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Component insertion | 300ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Layout changes | 500–800ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Selection border | 100ms | ease-out |

---

## Chatbot Theme (Dark)

| Element | Style |
|---------|-------|
| Background | `bg-gray-950` (#0a0a0a) |
| Sidebar | Dark with subtle border |
| Messages (user) | Lighter card on dark bg |
| Messages (bot) | Widget cards with dark border |
| Input bar | Dark with subtle focus ring |
| Widget cards | Dark background, subtle border, rounded corners |

---

**Summary**: Clean, minimalist design system. Brand blue for selection/focus. Light backgrounds for editor, dark theme for chatbot. 4px spacing grid. Three elevation levels. Smooth animations (100–300ms). Email canvas uses email-safe fonts (Arial). Component categories colour-coded in left panel.
