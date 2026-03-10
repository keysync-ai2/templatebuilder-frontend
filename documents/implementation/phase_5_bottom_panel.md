# Phase 5 — Bottom Panel (HTML Code Viewer/Editor)

**Goal**: HTML output with syntax highlighting, scope selector, and bidirectional code editing.

---

## Step 1: HTML Generator

| | Detail |
|---|--------|
| **What** | Convert component tree to email-safe HTML |
| **How** | Create `email-builder/htmlGenerator.js` — recursive tree → HTML string |
| **Output** | Complete email HTML document from component tree |
| **Validation** | Component tree with rows/columns/text → valid HTML table output |

**HTML structure rules:**
- Outer wrapper: `<html><body><div><table width="100%">...</table></div></body></html>`
- Each Row → `<tr>`
- Each Column → `<td width="X%">`
- Leaf components → nested `<table>` inside `<td>`
- All styles inline (no `<style>` blocks)
- No flexbox, no grid — tables only
- Padding/margin via CSS on `<td>` elements
- Images: `display:block`, explicit width/height

---

## Step 2: Syntax Highlighting

| | Detail |
|---|--------|
| **What** | Display generated HTML with syntax highlighting |
| **How** | Use `react-syntax-highlighter` with HTML language and chosen theme |
| **Output** | Coloured HTML code in bottom panel |
| **Validation** | Tags in blue, attributes in green, values in red, comments in gray |

**Theme options:**
- Dark: `atomOneDark` or `vs2015`
- Light: `github` or `xcode`

---

## Step 3: Scope Selector

| | Detail |
|---|--------|
| **What** | Toggle between viewing full template HTML or selected component HTML |
| **How** | Dropdown/radio: "Full Template" vs "Selected Component" |
| **Output** | Scope changes what HTML is displayed |
| **Validation** | Select a text component → switch to "Selected Component" → only that component's HTML shown |

---

## Step 4: Copy & Download

| | Detail |
|---|--------|
| **What** | Copy HTML to clipboard and download as .html file |
| **How** | Copy: `navigator.clipboard.writeText()`. Download: create Blob + `<a>` download. |
| **Output** | "Copy" button copies HTML. "Download" saves as file. |
| **Validation** | Click copy → paste in editor → valid HTML. Click download → .html file saves. |

---

## Step 5: Editable Code Mode

| | Detail |
|---|--------|
| **What** | Allow direct HTML editing in the bottom panel |
| **How** | Toggle between read-only viewer and editable textarea/code editor |
| **Output** | User can type HTML directly |
| **Validation** | Switch to edit mode → modify HTML → text is editable |

---

## Step 6: Bidirectional Sync

| | Detail |
|---|--------|
| **What** | Changes in code editor update the visual canvas |
| **How** | Parse edited HTML → reconstruct component tree → dispatch `loadTemplate()` |
| **Output** | Edit HTML → click "Apply" → canvas updates |
| **Validation** | Change text in HTML code → apply → canvas shows updated text |

**Warning system:**
- Alert if manual HTML changes will be overwritten by visual edits
- "Apply Changes" button validates HTML before syncing
- Invalid HTML → show error, highlight problematic lines

---

## Step 7: Resizable Divider

| | Detail |
|---|--------|
| **What** | Draggable divider between canvas and bottom panel |
| **How** | CSS resize or custom drag handler |
| **Output** | User can resize bottom panel height (30–40% default) |
| **Validation** | Drag divider → bottom panel grows/shrinks. Double-click → collapse/expand. |

**Constraints:**
- Minimum height: 100px (bottom panel)
- Minimum height: 200px (canvas area)

---

## Phase 5 Checkpoint

| Check | Expected |
|-------|----------|
| HTML generated | Component tree → valid email HTML |
| Syntax highlighting | Coloured code display |
| Scope selector | Full template vs selected component |
| Copy to clipboard | Copies HTML string |
| Download HTML | Saves .html file |
| Edit mode | Editable code area |
| Bidirectional sync | Code changes → canvas updates |
| Resizable divider | Drag to resize panels |
| Email-safe HTML | Tables only, inline styles, no flexbox |
