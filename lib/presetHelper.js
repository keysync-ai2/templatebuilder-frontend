/**
 * Preset injection helper — merges a preset's components into the current template.
 * Frontend equivalent of backend engine/builder.py inject_preset().
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Remap all IDs in a component tree to avoid conflicts.
 */
function remapIds(components) {
  const cloned = JSON.parse(JSON.stringify(components));

  function walk(items) {
    for (const comp of items) {
      comp.id = uuidv4();
      if (comp.children && Array.isArray(comp.children)) {
        walk(comp.children);
      }
    }
  }

  walk(cloned);
  return cloned;
}

/**
 * Apply variable substitutions to component props.
 */
function applyVariables(components, variables = {}, customizations = {}) {
  const defaults = {};
  for (const [key, val] of Object.entries(variables)) {
    if (typeof val === 'object' && val.default !== undefined) {
      defaults[key] = val.default;
    }
  }

  const merged = { ...defaults, ...customizations };
  if (Object.keys(merged).length === 0) return components;

  function walk(items) {
    for (const comp of items) {
      const props = comp.props || {};
      for (const [key, val] of Object.entries(props)) {
        if (typeof val === 'string') {
          let replaced = val;
          for (const [varName, varVal] of Object.entries(merged)) {
            replaced = replaced.replaceAll(`{{${varName}}}`, String(varVal));
          }
          props[key] = replaced;
        }
      }
      if (comp.children && Array.isArray(comp.children)) {
        walk(comp.children);
      }
    }
  }

  walk(components);
  return components;
}

/**
 * Inject a preset into the current component tree.
 *
 * @param {Array} currentComponents - Current template components
 * @param {Object} presetData - Preset object with components, variables
 * @param {Object} customizations - Variable overrides
 * @param {number} position - Insert position (-1 = append)
 * @returns {Array} New components array with preset injected
 */
export function inject_preset(currentComponents, presetData, customizations = {}, position = -1) {
  let presetComponents = presetData.components || [];
  if (presetComponents.length === 0) return currentComponents;

  // Deep clone and remap IDs
  presetComponents = remapIds(presetComponents);

  // Apply variable substitutions
  const variables = presetData.variables || {};
  const presetCustomizations = presetData.customizations || {};
  applyVariables(presetComponents, variables, { ...presetCustomizations, ...customizations });

  // Set root components to parentId: null
  for (const comp of presetComponents) {
    comp.parentId = null;
  }

  // Insert into current components
  const result = [...currentComponents];
  if (position < 0 || position >= result.length) {
    result.push(...presetComponents);
  } else {
    result.splice(position, 0, ...presetComponents);
  }

  return result;
}
