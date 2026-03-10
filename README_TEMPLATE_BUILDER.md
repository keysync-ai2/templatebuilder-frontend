# Email Template Builder

A comprehensive drag-and-drop email template builder integrated as a widget in the chatbot application.

## Features

### Interactive Template Builder
- **Drag and Drop**: Intuitive drag-and-drop interface for building email templates
- **Real-time Preview**: See changes instantly in the canvas
- **Component Library**: Pre-built components ready to use

### Layout (25% - 50% - 25%)
The template builder uses a three-panel layout:

#### Left Panel (25%)
Draggable components including:
- **Column Layouts**: 1, 2, 3 column configurations
- **Text Component**: Rich text content
- **Image Component**: Image placeholders with URL support
- **Button Component**: Call-to-action buttons with links

#### Middle Section (50%)
- **Canvas Area**: Main working area for building templates
- **Row Management**: Add, delete, and reorder rows
- **Column Management**: Add, delete, and configure columns
- **Inline Editing**: Edit text content directly on canvas
- **Selection System**: Click to select rows/columns for editing

#### Right Panel (25%)
- **Content Tab**: Edit element properties (name, description, text, URLs)
- **Styles Tab**: Configure visual properties:
  - Background color
  - Text color
  - Font family and size
  - Text alignment
  - Padding (top, bottom, left, right)

### Component System

All components are table-based for maximum email client compatibility:
- Each row is a `<table>` element
- Columns are `<td>` elements within rows
- Components (text, image, button) are nested within table cells

### JSON Structure

Templates follow this structure:

```javascript
{
  "name": "Template Name",
  "description": "Template description",
  "id": "template-id",
  "createdAt": "2025-01-01",
  "data": {
    "subject": "Email subject",
    "body": [
      {
        "RowID": "Row-unique-id",
        "Name": "Row Name",
        "Description": "Row description",
        "Columns": [
          {
            "ColumnID": "Column-unique-id",
            "Name": "Column Name",
            "Type": "Text" | "Image" | "Button",
            "Text": "Content text...",
            "Image": "https://example.com/image.jpg",
            "URL": "https://example.com",
            "Style": {
              "padding": { "top": 10, "bottom": 10, "left": 10, "right": 10 },
              "margin": { "top": 0, "bottom": 0, "left": 0, "right": 0 },
              "backgroundColor": "#ffffff",
              "color": "#000000",
              "fontFamily": "Arial, sans-serif",
              "fontSize": 16,
              "textAlign": "left"
            }
          }
        ],
        "Style": {
          "padding": { "top": 10, "bottom": 10, "left": 10, "right": 10 }
        }
      }
    ]
  }
}
```

## Usage in Chatbot

### Trigger the Template Builder

Type any of these messages in the chatbot:
- "template"
- "email builder"
- "create template"

The bot will respond with the template builder widget.

### Demo Example

```javascript
{
  type: 'template-builder',
  data: {
    title: 'Email Template Builder',
    description: 'Create beautiful email templates',
    timestamp: new Date().toISOString(),
  }
}
```

## Features

### Drag and Drop
1. Drag components from the left panel
2. Drop onto the canvas to add rows
3. Drag column layouts to create multi-column rows
4. Reorder rows by dragging their headers

### Editing Content
1. **Text**: Click to select, edit directly on canvas or in right panel
2. **Images**: Select and update URL in right panel
3. **Buttons**: Edit text and link URL in right panel

### Styling
1. Select any element (row or column)
2. Open the "Styles" tab in the right panel
3. Adjust colors, fonts, alignment, padding
4. Changes reflect immediately on canvas

### Export & Import
- **Export JSON**: Download template as JSON file
- **Import JSON**: Upload previously saved templates
- **View HTML**: Preview and copy generated HTML code

## HTML Rendering

The builder generates email-compatible HTML:
- Table-based layout for maximum compatibility
- Inline styles for consistent rendering
- 600px width container (email standard)
- Responsive image handling

### Generated HTML Structure

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <table width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table width="600" cellspacing="0" cellpadding="0">
          <!-- Template content here -->
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

## Redux State Management

### Template Builder Slice

Actions available:
- `setTemplate`: Load a complete template
- `updateTemplateMeta`: Update name, description, subject
- `addRow`: Add a new row to the template
- `deleteRow`: Remove a row
- `updateRow`: Modify row properties
- `moveRow`: Reorder rows
- `addColumn`: Add column to a row
- `deleteColumn`: Remove a column
- `updateColumn`: Modify column content
- `updateColumnStyle`: Change column styles
- `setSelectedElement`: Select element for editing
- `clearSelectedElement`: Deselect element
- `resetTemplate`: Clear template and start fresh

## Component Files

```
components/template-builder/
├── TemplateBuilder.js      # Main component with DnD context
├── LeftPanel.js            # Draggable components panel
├── Canvas.js               # Main editing canvas
├── RightPanel.js           # Properties and styles panel
└── TemplateRenderer.js     # JSON to HTML converter

components/widgets/
└── TemplateBuilderWidget.js  # Chatbot widget wrapper

store/slices/
└── templateBuilderSlice.js   # Redux state management
```

## Technical Stack

- **@dnd-kit/core**: Modern drag-and-drop library (React 19 compatible)
- **@dnd-kit/sortable**: Sortable list functionality
- **Redux Toolkit**: State management
- **uuid**: Unique ID generation
- **Next.js**: Framework
- **Tailwind CSS**: Styling

## Email Client Compatibility

The generated HTML follows best practices for email:
- Table-based layouts
- Inline styles only
- No JavaScript
- No external stylesheets
- 600px max width
- Minimal CSS properties
- PNG/JPG images only

## Future Enhancements

Potential improvements:
- Undo/Redo functionality
- More component types (divider, spacer, social icons)
- Pre-built template library
- Variable/placeholder system
- Mobile preview
- Send test email
- Template versioning
- Collaboration features
- Image upload/library

## Getting Started

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Open chatbot:**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Trigger builder:**
   Type "template" in the chat

4. **Start building:**
   - Drag components from left panel
   - Edit content and styles
   - Export when ready

## Tips

- Use column layouts first, then add content components
- Select elements before editing in right panel
- Export JSON regularly to save progress
- Preview HTML before sending to verify compatibility
- Keep layouts simple for best email client support
- Test in multiple email clients before production use

## Example Templates

Check `project/template.json` for a complete example template structure.

## Troubleshooting

**Issue**: Components not dropping
- **Solution**: Make sure you're dropping onto the canvas area

**Issue**: Styles not applying
- **Solution**: Select the element first, then modify in right panel

**Issue**: Export not working
- **Solution**: Ensure template has content before exporting

**Issue**: HTML not rendering correctly
- **Solution**: Check that all image URLs are valid and accessible
