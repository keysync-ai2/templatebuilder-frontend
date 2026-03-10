// Component Library Definitions

export const COMPONENT_TYPES = {
  TEXT: 'text',
  HEADING: 'heading',
  BUTTON: 'button',
  IMAGE: 'image',
  DIVIDER: 'divider',
  SPACER: 'spacer',
  SECTION: 'section',
  CONTAINER: 'container',
  ROW: 'row',
  COLUMN: 'column',
};

export const BASIC_COMPONENTS = [
  {
    id: 'text',
    type: COMPONENT_TYPES.TEXT,
    name: 'Text',
    icon: 'faAlignLeft',
    category: 'basic',
    defaultProps: {
      content: 'Enter your text here...',
      fontSize: 14,
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'left',
      padding: '10px',
    },
  },
  {
    id: 'heading',
    type: COMPONENT_TYPES.HEADING,
    name: 'Heading',
    icon: 'faHeading',
    category: 'basic',
    defaultProps: {
      content: 'Heading Text',
      level: 'h2',
      fontSize: 24,
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'left',
      padding: '10px',
    },
  },
  {
    id: 'button',
    type: COMPONENT_TYPES.BUTTON,
    name: 'Button',
    icon: 'faSquare',
    category: 'basic',
    defaultProps: {
      text: 'Click Me',
      href: '#',
      backgroundColor: '#2563EB',
      color: '#FFFFFF',
      padding: '12px 24px',
      borderRadius: '4px',
      textAlign: 'center',
    },
  },
  {
    id: 'image',
    type: COMPONENT_TYPES.IMAGE,
    name: 'Image',
    icon: 'faImage',
    category: 'basic',
    defaultProps: {
      src: 'https://via.placeholder.com/600x300',
      alt: 'Image',
      width: '100%',
      height: 'auto',
    },
  },
  {
    id: 'divider',
    type: COMPONENT_TYPES.DIVIDER,
    name: 'Divider',
    icon: 'faMinus',
    category: 'basic',
    defaultProps: {
      borderColor: '#E5E7EB',
      borderWidth: '1px',
      margin: '20px 0',
    },
  },
  {
    id: 'spacer',
    type: COMPONENT_TYPES.SPACER,
    name: 'Spacer',
    icon: 'faArrowsUpDown',
    category: 'basic',
    defaultProps: {
      height: '20px',
    },
  },
];

export const COLUMN_COMPONENTS = [
  {
    id: 'column-1',
    type: COMPONENT_TYPES.ROW,
    name: 'Single Column',
    icon: '▯',
    category: 'column',
    defaultProps: {
      columns: 1,
    },
    children: [
      {
        type: COMPONENT_TYPES.COLUMN,
        defaultProps: {
          width: '100%',
        },
        children: [],
      },
    ],
  },
  {
    id: 'column-2',
    type: COMPONENT_TYPES.ROW,
    name: 'Two Columns',
    icon: '▯▯',
    category: 'column',
    defaultProps: {
      columns: 2,
    },
    children: [
      {
        type: COMPONENT_TYPES.COLUMN,
        defaultProps: {
          width: '50%',
        },
        children: [],
      },
      {
        type: COMPONENT_TYPES.COLUMN,
        defaultProps: {
          width: '50%',
        },
        children: [],
      },
    ],
  },
  {
    id: 'column-3',
    type: COMPONENT_TYPES.ROW,
    name: 'Three Columns',
    icon: '▯▯▯',
    category: 'column',
    defaultProps: {
      columns: 3,
    },
    children: [
      {
        type: COMPONENT_TYPES.COLUMN,
        defaultProps: {
          width: '33.33%',
        },
        children: [],
      },
      {
        type: COMPONENT_TYPES.COLUMN,
        defaultProps: {
          width: '33.33%',
        },
        children: [],
      },
      {
        type: COMPONENT_TYPES.COLUMN,
        defaultProps: {
          width: '33.33%',
        },
        children: [],
      },
    ],
  },
  {
    id: 'column-1-2',
    type: COMPONENT_TYPES.ROW,
    name: '1/3 - 2/3 Columns',
    icon: '▯▮',
    category: 'column',
    defaultProps: {
      columns: 2,
    },
    children: [
      {
        type: COMPONENT_TYPES.COLUMN,
        defaultProps: {
          width: '33.33%',
        },
        children: [],
      },
      {
        type: COMPONENT_TYPES.COLUMN,
        defaultProps: {
          width: '66.67%',
        },
        children: [],
      },
    ],
  },
  {
    id: 'column-2-1',
    type: COMPONENT_TYPES.ROW,
    name: '2/3 - 1/3 Columns',
    icon: '▮▯',
    category: 'column',
    defaultProps: {
      columns: 2,
    },
    children: [
      {
        type: COMPONENT_TYPES.COLUMN,
        defaultProps: {
          width: '66.67%',
        },
        children: [],
      },
      {
        type: COMPONENT_TYPES.COLUMN,
        defaultProps: {
          width: '33.33%',
        },
        children: [],
      },
    ],
  },
  {
    id: 'column-4',
    type: COMPONENT_TYPES.ROW,
    name: 'Four Columns',
    icon: '▯▯▯▯',
    category: 'column',
    defaultProps: {
      columns: 4,
    },
    children: [
      {
        type: COMPONENT_TYPES.COLUMN,
        defaultProps: {
          width: '25%',
        },
        children: [],
      },
      {
        type: COMPONENT_TYPES.COLUMN,
        defaultProps: {
          width: '25%',
        },
        children: [],
      },
      {
        type: COMPONENT_TYPES.COLUMN,
        defaultProps: {
          width: '25%',
        },
        children: [],
      },
      {
        type: COMPONENT_TYPES.COLUMN,
        defaultProps: {
          width: '25%',
        },
        children: [],
      },
    ],
  },
];

export const CONTAINER_COMPONENTS = [
  {
    id: 'section',
    type: COMPONENT_TYPES.SECTION,
    name: 'Section',
    icon: '📦',
    category: 'container',
    defaultProps: {
      backgroundColor: '#FFFFFF',
      padding: '20px',
    },
    children: [],
  },
  {
    id: 'container',
    type: COMPONENT_TYPES.CONTAINER,
    name: 'Container',
    icon: '🗂️',
    category: 'container',
    defaultProps: {
      maxWidth: '600px',
      padding: '20px',
    },
    children: [],
  },
];

export const ALL_COMPONENTS = [
  ...BASIC_COMPONENTS,
  ...COLUMN_COMPONENTS,
  ...CONTAINER_COMPONENTS,
];

export function getComponentByType(type) {
  return ALL_COMPONENTS.find(comp => comp.type === type);
}

export function getComponentById(id) {
  return ALL_COMPONENTS.find(comp => comp.id === id);
}
