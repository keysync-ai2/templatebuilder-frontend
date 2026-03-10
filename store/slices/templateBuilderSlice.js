import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  template: {
    name: 'Untitled Template',
    description: '',
    id: null,
    createdAt: null,
    data: {
      subject: '',
      body: []
    }
  },
  selectedElement: null, // { type: 'row' | 'column', id: string }
  history: [],
  historyIndex: -1,
};

export const templateBuilderSlice = createSlice({
  name: 'templateBuilder',
  initialState,
  reducers: {
    setTemplate: (state, action) => {
      state.template = action.payload;
    },

    updateTemplateMeta: (state, action) => {
      const { name, description, subject } = action.payload;
      if (name !== undefined) state.template.name = name;
      if (description !== undefined) state.template.description = description;
      if (subject !== undefined) state.template.data.subject = subject;
    },

    addRow: (state, action) => {
      const newRow = {
        RowID: `Row-${uuidv4()}`,
        Name: action.payload?.name || 'New Row',
        Description: '',
        Columns: [],
        Style: {
          padding: { top: 10, bottom: 10, left: 10, right: 10 }
        }
      };
      state.template.data.body.push(newRow);
    },

    deleteRow: (state, action) => {
      state.template.data.body = state.template.data.body.filter(
        row => row.RowID !== action.payload
      );
      if (state.selectedElement?.type === 'row' && state.selectedElement?.id === action.payload) {
        state.selectedElement = null;
      }
    },

    updateRow: (state, action) => {
      const { rowId, updates } = action.payload;
      const row = state.template.data.body.find(r => r.RowID === rowId);
      if (row) {
        Object.assign(row, updates);
      }
    },

    moveRow: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const [removed] = state.template.data.body.splice(fromIndex, 1);
      state.template.data.body.splice(toIndex, 0, removed);
    },

    addColumn: (state, action) => {
      const { rowId, columnType } = action.payload;
      const row = state.template.data.body.find(r => r.RowID === rowId);

      if (row) {
        const newColumn = {
          ColumnID: `Column-${uuidv4()}`,
          Name: 'New Column',
          Description: '',
          Type: columnType || 'Text',
          Text: columnType === 'Text' ? 'Enter text here...' : undefined,
          Image: columnType === 'Image' ? 'https://via.placeholder.com/150' : undefined,
          URL: columnType === 'Button' ? '#' : undefined,
          Style: {
            padding: { top: 10, bottom: 10, left: 10, right: 10 },
            margin: { top: 0, bottom: 0, left: 0, right: 0 },
            backgroundColor: '#ffffff',
            textAlign: 'left',
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            color: '#000000'
          }
        };
        row.Columns.push(newColumn);
      }
    },

    deleteColumn: (state, action) => {
      const { rowId, columnId } = action.payload;
      const row = state.template.data.body.find(r => r.RowID === rowId);
      if (row) {
        row.Columns = row.Columns.filter(col => col.ColumnID !== columnId);
      }
      if (state.selectedElement?.type === 'column' && state.selectedElement?.id === columnId) {
        state.selectedElement = null;
      }
    },

    updateColumn: (state, action) => {
      const { rowId, columnId, updates } = action.payload;
      const row = state.template.data.body.find(r => r.RowID === rowId);
      if (row) {
        const column = row.Columns.find(c => c.ColumnID === columnId);
        if (column) {
          Object.assign(column, updates);
        }
      }
    },

    updateColumnStyle: (state, action) => {
      const { rowId, columnId, styleUpdates } = action.payload;
      const row = state.template.data.body.find(r => r.RowID === rowId);
      if (row) {
        const column = row.Columns.find(c => c.ColumnID === columnId);
        if (column) {
          column.Style = { ...column.Style, ...styleUpdates };
        }
      }
    },

    setSelectedElement: (state, action) => {
      state.selectedElement = action.payload;
    },

    clearSelectedElement: (state) => {
      state.selectedElement = null;
    },

    resetTemplate: (state) => {
      state.template = initialState.template;
      state.selectedElement = null;
    },
  },
});

export const {
  setTemplate,
  updateTemplateMeta,
  addRow,
  deleteRow,
  updateRow,
  moveRow,
  addColumn,
  deleteColumn,
  updateColumn,
  updateColumnStyle,
  setSelectedElement,
  clearSelectedElement,
  resetTemplate,
} = templateBuilderSlice.actions;

export default templateBuilderSlice.reducer;
