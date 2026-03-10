import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { COMPONENT_TYPES } from '../../components/email-builder/componentLibrary';

// Create default single column row
const createDefaultRow = () => ({
  id: uuidv4(),
  type: COMPONENT_TYPES.ROW,
  props: {
    columns: 1,
  },
  parentId: null,
  children: [
    {
      id: uuidv4(),
      type: COMPONENT_TYPES.COLUMN,
      props: {
        width: '100%',
      },
      children: [],
      parentId: null,
    },
  ],
  visibility: true,
  locked: false,
});

const initialState = {
  // Template metadata
  templateId: null,
  templateName: 'Untitled Template',
  templateSubject: '',
  templateFrom: '',
  templateReplyTo: '',

  // Component tree - start with a default single column row
  components: [createDefaultRow()],

  // Selection & UI state
  selectedComponentId: null,
  hoveredComponentId: null,

  // Viewport/zoom
  zoomLevel: 100,
  devicePreview: 'desktop', // 'desktop' | 'tablet' | 'mobile'

  // Editor settings
  showGrid: false,
  showLayerHints: true,
};

export const emailBuilderSlice = createSlice({
  name: 'emailBuilder',
  initialState,
  reducers: {
    // Component Management
    addComponent: (state, action) => {
      const { component, parentId, position } = action.payload;
      const newComponent = {
        id: uuidv4(),
        ...component,
        parentId: parentId || null,
        children: component.children || [],
        visibility: true,
        locked: false,
      };

      if (parentId) {
        const parent = findComponentById(state.components, parentId);
        if (parent) {
          if (position !== undefined) {
            parent.children.splice(position, 0, newComponent);
          } else {
            parent.children.push(newComponent);
          }
        }
      } else {
        if (position !== undefined) {
          state.components.splice(position, 0, newComponent);
        } else {
          state.components.push(newComponent);
        }
      }
    },

    removeComponent: (state, action) => {
      const componentId = action.payload;
      state.components = removeComponentFromTree(state.components, componentId);
      if (state.selectedComponentId === componentId) {
        state.selectedComponentId = null;
      }
    },

    updateComponent: (state, action) => {
      const { componentId, updates } = action.payload;
      const component = findComponentById(state.components, componentId);
      if (component) {
        Object.assign(component, updates);
      }
    },

    moveComponent: (state, action) => {
      const { componentId, newPosition, newParentId } = action.payload;
      // Find and clone the component before removing it
      const component = findComponentById(state.components, componentId);
      if (!component) return;

      const clonedComponent = JSON.parse(JSON.stringify(component));

      // Find the old parent and index
      const oldParent = findParentComponent(state.components, componentId);
      const oldParentId = oldParent ? oldParent.id : null;

      let oldIndex = -1;
      if (oldParentId) {
        oldIndex = oldParent.children.findIndex(c => c.id === componentId);
      } else {
        oldIndex = state.components.findIndex(c => c.id === componentId);
      }

      // Remove from current location
      state.components = removeComponentFromTree(state.components, componentId);

      // Adjust newPosition if moving within the same parent and moving down
      let adjustedPosition = newPosition;
      if (oldParentId === newParentId && oldIndex !== -1 && oldIndex < newPosition) {
        adjustedPosition = newPosition - 1;
      }

      // Add to new location
      if (newParentId) {
        const parent = findComponentById(state.components, newParentId);
        if (parent) {
          if (adjustedPosition === undefined) {
            parent.children.push(clonedComponent);
          } else {
            parent.children.splice(adjustedPosition, 0, clonedComponent);
          }
        }
      } else {
        if (adjustedPosition === undefined) {
          state.components.push(clonedComponent);
        } else {
          state.components.splice(adjustedPosition, 0, clonedComponent);
        }
      }
    },

    duplicateComponent: (state, action) => {
      const componentId = action.payload;
      const component = findComponentById(state.components, componentId);
      if (!component) return;

      const duplicate = JSON.parse(JSON.stringify(component));
      assignNewIds(duplicate);

      const parent = findParentComponent(state.components, componentId);
      if (parent) {
        const index = parent.children.findIndex(c => c.id === componentId);
        parent.children.splice(index + 1, 0, duplicate);
      } else {
        const index = state.components.findIndex(c => c.id === componentId);
        state.components.splice(index + 1, 0, duplicate);
      }
    },

    replaceComponent: (state, action) => {
      const { componentId, newComponent } = action.payload;
      const parent = findParentComponent(state.components, componentId);

      if (parent) {
        const index = parent.children.findIndex(c => c.id === componentId);
        if (index !== -1) {
          parent.children[index] = newComponent;
        }
      } else {
        const index = state.components.findIndex(c => c.id === componentId);
        if (index !== -1) {
          state.components[index] = newComponent;
        }
      }
    },

    // Selection
    selectComponent: (state, action) => {
      state.selectedComponentId = action.payload;
    },

    setHoveredComponent: (state, action) => {
      state.hoveredComponentId = action.payload;
    },

    // Template Management
    updateTemplateMeta: (state, action) => {
      const { name, subject, from, replyTo } = action.payload;
      if (name !== undefined) state.templateName = name;
      if (subject !== undefined) state.templateSubject = subject;
      if (from !== undefined) state.templateFrom = from;
      if (replyTo !== undefined) state.templateReplyTo = replyTo;
    },

    createNewTemplate: (state) => {
      return {
        ...initialState,
        components: [createDefaultRow()],
      };
    },

    loadTemplate: (state, action) => {
      const { templateName, templateSubject, templateFrom, templateReplyTo, components } = action.payload;
      state.templateName = templateName || 'Untitled Template';
      state.templateSubject = templateSubject || '';
      state.templateFrom = templateFrom || '';
      state.templateReplyTo = templateReplyTo || '';
      state.components = components || [createDefaultRow()];
      state.selectedComponentId = null;
    },

    // UI State
    setZoomLevel: (state, action) => {
      state.zoomLevel = action.payload;
    },

    setDevicePreview: (state, action) => {
      state.devicePreview = action.payload;
    },

    toggleShowGrid: (state) => {
      state.showGrid = !state.showGrid;
    },

    toggleLayerHints: (state) => {
      state.showLayerHints = !state.showLayerHints;
    },
  },
});

// Helper functions
function findComponentById(components, id) {
  for (const component of components) {
    if (component.id === id) return component;
    if (component.children) {
      const found = findComponentById(component.children, id);
      if (found) return found;
    }
  }
  return null;
}

function findParentComponent(components, childId, parent = null) {
  for (const component of components) {
    if (component.children) {
      if (component.children.some(c => c.id === childId)) {
        return component;
      }
      const found = findParentComponent(component.children, childId, component);
      if (found) return found;
    }
  }
  return null;
}

function removeComponentFromTree(components, id) {
  return components.filter(component => {
    if (component.id === id) return false;
    if (component.children) {
      component.children = removeComponentFromTree(component.children, id);
    }
    return true;
  });
}

function assignNewIds(component) {
  component.id = uuidv4();
  if (component.children) {
    component.children.forEach(child => assignNewIds(child));
  }
}

export const {
  addComponent,
  removeComponent,
  updateComponent,
  moveComponent,
  duplicateComponent,
  replaceComponent,
  selectComponent,
  setHoveredComponent,
  updateTemplateMeta,
  loadTemplate,
  createNewTemplate,
  setZoomLevel,
  setDevicePreview,
  toggleShowGrid,
  toggleLayerHints,
} = emailBuilderSlice.actions;

export default emailBuilderSlice.reducer;
