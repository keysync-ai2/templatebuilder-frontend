# Email Template Builder — Widget Payload Reference

## Overview

The chatbot renders structured responses using JSON widget payloads. Each bot message contains a `widgets[]` array. The `WidgetRenderer` component dispatches each widget to its matching component based on the `type` field.

---

## Widget Payload Structure

```javascript
{
  type: string,   // widget type identifier
  data: {         // type-specific data
    timestamp: string  // ISO 8601 timestamp (always present)
    // ... additional fields per type
  }
}
```

---

## Paragraph Widget

Renders formatted text.

```json
{
  "type": "paragraph",
  "data": {
    "text": "Here is the data you requested in table format:",
    "timestamp": "2026-03-10T12:00:00.000Z"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | Yes | Text content (supports `\n` for line breaks) |
| `timestamp` | string | Yes | ISO 8601 timestamp |

---

## Table Widget

Renders tabular data with columns and rows.

```json
{
  "type": "table",
  "data": {
    "title": "Sales Report",
    "columns": ["Product", "Q1", "Q2", "Q3", "Q4"],
    "rows": [
      ["Product A", "$12,000", "$15,000", "$18,000", "$20,000"],
      ["Product B", "$8,000", "$9,500", "$11,000", "$13,500"]
    ],
    "timestamp": "2026-03-10T12:00:00.000Z"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Table title/heading |
| `columns` | string[] | Yes | Column header labels |
| `rows` | string[][] | Yes | Row data (array of arrays) |
| `timestamp` | string | Yes | ISO 8601 timestamp |

---

## Bullets Widget

Renders ordered or unordered lists.

```json
{
  "type": "bullets",
  "data": {
    "title": "Key Points",
    "items": [
      "First important point",
      "Second key insight",
      "Third consideration"
    ],
    "ordered": false,
    "timestamp": "2026-03-10T12:00:00.000Z"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | List title |
| `items` | string[] | Yes | List items |
| `ordered` | boolean | Yes | `true` for numbered, `false` for bulleted |
| `timestamp` | string | Yes | ISO 8601 timestamp |

---

## Form Widget

Renders an interactive form with various field types.

```json
{
  "type": "form",
  "data": {
    "title": "Contact Form",
    "fields": [
      {
        "name": "name",
        "label": "Full Name",
        "type": "text",
        "placeholder": "Enter your name",
        "required": true
      },
      {
        "name": "email",
        "label": "Email Address",
        "type": "email",
        "placeholder": "your.email@example.com",
        "required": true
      },
      {
        "name": "category",
        "label": "Category",
        "type": "select",
        "options": [
          { "label": "General Inquiry", "value": "general" },
          { "label": "Support", "value": "support" }
        ],
        "required": true
      },
      {
        "name": "message",
        "label": "Message",
        "type": "textarea",
        "placeholder": "Type your message...",
        "required": true
      }
    ],
    "submitLabel": "Submit",
    "timestamp": "2026-03-10T12:00:00.000Z"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Form title |
| `fields` | Field[] | Yes | Array of form field definitions |
| `submitLabel` | string | Yes | Submit button text |
| `timestamp` | string | Yes | ISO 8601 timestamp |

### Field Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Field identifier |
| `label` | string | Yes | Display label |
| `type` | string | Yes | `text`, `email`, `select`, `textarea` |
| `placeholder` | string | No | Placeholder text |
| `required` | boolean | Yes | Validation flag |
| `options` | Option[] | For `select` only | Dropdown options |

### Option Object (for select fields)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | Yes | Display text |
| `value` | string | Yes | Submitted value |

---

## Image Widget

Renders an image with optional caption.

```json
{
  "type": "image",
  "data": {
    "url": "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
    "alt": "Sample Image",
    "caption": "A beautiful sample image",
    "timestamp": "2026-03-10T12:00:00.000Z"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | Image URL |
| `alt` | string | Yes | Alt text |
| `caption` | string | No | Caption text below image |
| `timestamp` | string | Yes | ISO 8601 timestamp |

---

## Template Builder Widget

Embeds the full email template builder inside the chat.

```json
{
  "type": "template-builder",
  "data": {
    "title": "Email Template Builder",
    "description": "Create beautiful email templates with drag-and-drop interface",
    "timestamp": "2026-03-10T12:00:00.000Z"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Builder title |
| `description` | string | No | Description text |
| `timestamp` | string | Yes | ISO 8601 timestamp |

---

## Trigger Keywords

The chatbot currently uses keyword matching to generate widget responses:

| User Input Contains | Widget Response |
|-------------------|----------------|
| `table`, `data` | Paragraph + Table |
| `list`, `bullet` | Bullets |
| `form` | Paragraph + Form |
| `image` | Paragraph + Image |
| `template`, `email builder` | Paragraph + Template Builder |
| (anything else) | Default paragraph with help text |

---

**Summary**: 6 widget types — paragraph, table, bullets, form, image, template-builder. All widgets have a `type` + `data` structure with a required `timestamp`. Bot messages contain a `widgets[]` array. The chatbot generates responses based on keyword matching (to be replaced with AI backend).
