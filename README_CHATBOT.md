# Template Builder - Widget-Based Chatbot

A modern, widget-based chatbot application built with Next.js, React, Redux, and Tailwind CSS featuring a dark theme.

## Features

### Widget Components
The chatbot supports multiple widget types driven by JSON payloads:

1. **Paragraph Widget** - Display formatted text
2. **Table Widget** - Display tabular data with headers and rows
3. **Bullets Widget** - Display ordered or unordered lists
4. **Image Widget** - Display images with captions and full-screen view
5. **Form Widget** - Interactive forms with various input types

### Layout
- **Dark Theme** - Appealing dark color scheme
- **Left Panel** - Chat history management
- **Main Chat Area** - Message display with widget rendering
- **Right Panel** - Full-screen widget view
- **Header** - Logo, settings, profile management
- **Chat Input** - Text input with file attachment support

## Project Structure

```
template-builder/
├── app/
│   ├── layout.js          # Root layout with Redux Provider
│   ├── page.js            # Main chatbot page
│   └── globals.css        # Global dark theme styles
├── components/
│   ├── chat/
│   │   ├── ChatArea.js    # Message display area
│   │   └── ChatInput.js   # Input with attachments
│   ├── layout/
│   │   ├── Header.js      # Top navigation bar
│   │   ├── Sidebar.js     # Left panel with history
│   │   └── RightPanel.js  # Right panel for full-screen widgets
│   └── widgets/
│       ├── ParagraphWidget.js
│       ├── TableWidget.js
│       ├── BulletsWidget.js
│       ├── ImageWidget.js
│       ├── FormWidget.js
│       └── WidgetRenderer.js  # Dynamic widget renderer
└── store/
    ├── index.js           # Redux store configuration
    ├── ReduxProvider.js   # Client-side provider
    └── slices/
        ├── chatSlice.js   # Chat state management
        └── uiSlice.js     # UI state management
```

## Widget Payload Structure

All widgets are rendered from JSON payloads with the following structure:

```javascript
{
  type: 'widget_type',
  data: {
    // Widget-specific data
    timestamp: 'ISO 8601 timestamp'
  }
}
```

### Paragraph Widget
```javascript
{
  type: 'paragraph',
  data: {
    text: 'Your text content here',
    timestamp: '2024-01-01T00:00:00.000Z'
  }
}
```

### Table Widget
```javascript
{
  type: 'table',
  data: {
    title: 'Table Title',
    columns: ['Column 1', 'Column 2', 'Column 3'],
    rows: [
      ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
      ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
    ],
    timestamp: '2024-01-01T00:00:00.000Z'
  }
}
```

### Bullets Widget
```javascript
{
  type: 'bullets',
  data: {
    title: 'List Title',
    items: ['Item 1', 'Item 2', 'Item 3'],
    ordered: false,  // true for numbered list
    timestamp: '2024-01-01T00:00:00.000Z'
  }
}
```

### Image Widget
```javascript
{
  type: 'image',
  data: {
    url: 'https://example.com/image.jpg',
    alt: 'Image description',
    caption: 'Image caption',
    timestamp: '2024-01-01T00:00:00.000Z'
  }
}
```

### Form Widget
```javascript
{
  type: 'form',
  data: {
    title: 'Form Title',
    fields: [
      {
        name: 'field_name',
        label: 'Field Label',
        type: 'text', // text, email, number, tel, textarea, select, checkbox, radio
        placeholder: 'Placeholder text',
        required: true,
        options: [] // For select and radio types
      }
    ],
    submitLabel: 'Submit',
    timestamp: '2024-01-01T00:00:00.000Z'
  }
}
```

## Redux State Management

### Chat Slice
Manages conversations and messages:
- `conversations` - Array of conversation objects
- `currentConversationId` - Active conversation ID
- `messages` - Object mapping conversation IDs to message arrays
- `isLoading` - Loading state indicator

### UI Slice
Manages interface state:
- `leftPanelOpen` - Sidebar visibility
- `rightPanelOpen` - Right panel visibility
- `rightPanelContent` - Content for right panel
- `theme` - Theme preference

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Try the demo responses:
- Type "table" or "data" - See a table widget
- Type "list" or "bullet" - See a bullet list widget
- Type "form" - See an interactive form widget
- Type "image" - See an image widget

### Backend Integration

To connect with your backend, modify the `handleSendMessage` function in `app/page.js`:

```javascript
const handleSendMessage = async (messageData) => {
  // Add user message
  dispatch(addMessage({
    conversationId: currentConversationId,
    message: {
      role: 'user',
      text: messageData.text,
      attachments: messageData.attachments,
    },
  }));

  dispatch(setLoading(true));

  try {
    // Replace with your API call
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: messageData.text,
        conversationId: currentConversationId,
      }),
    });

    const data = await response.json();

    // Expect data.widgets to be an array of widget objects
    dispatch(addMessage({
      conversationId: currentConversationId,
      message: {
        role: 'assistant',
        widgets: data.widgets,
      },
    }));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    dispatch(setLoading(false));
  }
};
```

## Customization

### Adding New Widget Types

1. Create a new widget component in `components/widgets/`
2. Add the widget to `WidgetRenderer.js`
3. Define the payload structure for your widget

### Styling

The application uses Tailwind CSS with a dark theme. Colors are based on:
- Gray scale: `gray-50` to `gray-950`
- Primary: Blue (`blue-600`, `blue-700`)
- Backgrounds: `gray-800`, `gray-900`, `gray-950`

## Technologies Used

- **Next.js 16** - React framework
- **React 19** - UI library
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **JavaScript** - Programming language

## License

This project is part of the Template Builder application.
