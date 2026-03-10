'use client';

import { useSelector, useDispatch } from 'react-redux';
import { updateComponent } from '@/store/slices/emailBuilderSlice';
import { COMPONENT_TYPES } from './componentLibrary';
import { useState, useEffect, useRef } from 'react';
import ImageGallery from './ImageGallery';

// Helper function to find component by ID recursively
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

// Helper function to find parent component containing the given child ID
function findParentComponent(components, childId) {
  for (const component of components) {
    if (component.children) {
      if (component.children.some(c => c.id === childId)) {
        return component;
      }
      const found = findParentComponent(component.children, childId);
      if (found) return found;
    }
  }
  return null;
}

// Parse width value to percentage (e.g., "50%" -> 50, "300px" -> null)
function parseWidthToPercentage(width) {
  if (typeof width === 'string' && width.endsWith('%')) {
    return parseFloat(width);
  }
  return null;
}

// Redistribute remaining width among sibling columns
function redistributeColumnWidths(parentRow, currentColumnId, newWidth) {
  if (!parentRow || !parentRow.children || parentRow.children.length <= 1) {
    return null; // No siblings to redistribute
  }

  const newWidthPercent = parseWidthToPercentage(newWidth);
  if (newWidthPercent === null) {
    return null; // Can't redistribute if not using percentage
  }

  const siblingColumns = parentRow.children.filter(col => col.id !== currentColumnId);
  const remainingWidth = 100 - newWidthPercent;

  if (remainingWidth <= 0 || siblingColumns.length === 0) {
    return null;
  }

  // Calculate current total width of siblings
  let currentSiblingTotal = 0;
  const siblingWidths = siblingColumns.map(col => {
    const width = parseWidthToPercentage(col.props.width);
    currentSiblingTotal += width || 0;
    return width || (100 / parentRow.children.length);
  });

  // Distribute remaining width proportionally
  const updates = {};
  siblingColumns.forEach((col, index) => {
    const currentWidth = siblingWidths[index];
    const proportion = currentSiblingTotal > 0 ? currentWidth / currentSiblingTotal : 1 / siblingColumns.length;
    const newSiblingWidth = remainingWidth * proportion;
    updates[col.id] = `${newSiblingWidth.toFixed(2)}%`;
  });

  return updates;
}

// Interactive Padding Control Component
function PaddingControl({ value, onChange }) {
  const [mode, setMode] = useState('simple'); // 'simple' or 'advanced'
  const [paddingValues, setPaddingValues] = useState({ top: 10, right: 10, bottom: 10, left: 10 });

  useEffect(() => {
    if (value) {
      const parts = value.toString().replace('px', '').split(' ');
      if (parts.length === 1) {
        const val = parseInt(parts[0]) || 10;
        setPaddingValues({ top: val, right: val, bottom: val, left: val });
      } else if (parts.length === 2) {
        const vertical = parseInt(parts[0]) || 10;
        const horizontal = parseInt(parts[1]) || 10;
        setPaddingValues({ top: vertical, right: horizontal, bottom: vertical, left: horizontal });
      } else if (parts.length === 4) {
        setPaddingValues({
          top: parseInt(parts[0]) || 10,
          right: parseInt(parts[1]) || 10,
          bottom: parseInt(parts[2]) || 10,
          left: parseInt(parts[3]) || 10,
        });
        setMode('advanced');
      }
    }
  }, [value]);

  const handleSimpleChange = (val) => {
    const numVal = parseInt(val) || 0;
    setPaddingValues({ top: numVal, right: numVal, bottom: numVal, left: numVal });
    onChange(`${numVal}px`);
  };

  const handleAdvancedChange = (side, val) => {
    const numVal = parseInt(val) || 0;
    const newValues = { ...paddingValues, [side]: numVal };
    setPaddingValues(newValues);
    onChange(`${newValues.top}px ${newValues.right}px ${newValues.bottom}px ${newValues.left}px`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-gray-100 rounded p-1">
          <button
            onClick={() => setMode('simple')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              mode === 'simple'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Simple
          </button>
          <button
            onClick={() => setMode('advanced')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              mode === 'advanced'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {mode === 'simple' ? (
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            value={paddingValues.top}
            onChange={(e) => handleSimpleChange(e.target.value)}
            className="flex-1"
          />
          <input
            type="number"
            value={paddingValues.top}
            onChange={(e) => handleSimpleChange(e.target.value)}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-500">px</span>
        </div>
      ) : (
        <div className="relative">
          {/* Visual Box Representation */}
          <div className="border-2 border-gray-300 rounded-lg p-8 bg-gray-50 relative">
            {/* Top */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <span className="text-xs text-gray-500 mb-1">Top</span>
              <input
                type="number"
                value={paddingValues.top}
                onChange={(e) => handleAdvancedChange('top', e.target.value)}
                className="w-14 px-2 py-1 border border-gray-300 rounded text-xs text-center text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Right */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <span className="text-xs text-gray-500">R</span>
              <input
                type="number"
                value={paddingValues.right}
                onChange={(e) => handleAdvancedChange('right', e.target.value)}
                className="w-14 px-2 py-1 border border-gray-300 rounded text-xs text-center text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Bottom */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <input
                type="number"
                value={paddingValues.bottom}
                onChange={(e) => handleAdvancedChange('bottom', e.target.value)}
                className="w-14 px-2 py-1 border border-gray-300 rounded text-xs text-center text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500 mt-1">Bottom</span>
            </div>

            {/* Left */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <input
                type="number"
                value={paddingValues.left}
                onChange={(e) => handleAdvancedChange('left', e.target.value)}
                className="w-14 px-2 py-1 border border-gray-300 rounded text-xs text-center text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">L</span>
            </div>

            {/* Center Content */}
            <div className="bg-blue-100 border-2 border-blue-300 rounded h-16 flex items-center justify-center">
              <span className="text-xs text-blue-600 font-medium">Content</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Interactive Border Radius Control Component
function BorderRadiusControl({ value, onChange }) {
  const [mode, setMode] = useState('simple');
  const [radiusValues, setRadiusValues] = useState({ topLeft: 4, topRight: 4, bottomRight: 4, bottomLeft: 4 });

  useEffect(() => {
    if (value) {
      const parts = value.toString().replace('px', '').split(' ');
      if (parts.length === 1) {
        const val = parseInt(parts[0]) || 4;
        setRadiusValues({ topLeft: val, topRight: val, bottomRight: val, bottomLeft: val });
      } else if (parts.length === 4) {
        setRadiusValues({
          topLeft: parseInt(parts[0]) || 4,
          topRight: parseInt(parts[1]) || 4,
          bottomRight: parseInt(parts[2]) || 4,
          bottomLeft: parseInt(parts[3]) || 4,
        });
        setMode('advanced');
      }
    }
  }, [value]);

  const handleSimpleChange = (val) => {
    const numVal = parseInt(val) || 0;
    setRadiusValues({ topLeft: numVal, topRight: numVal, bottomRight: numVal, bottomLeft: numVal });
    onChange(`${numVal}px`);
  };

  const handleAdvancedChange = (corner, val) => {
    const numVal = parseInt(val) || 0;
    const newValues = { ...radiusValues, [corner]: numVal };
    setRadiusValues(newValues);
    onChange(`${newValues.topLeft}px ${newValues.topRight}px ${newValues.bottomRight}px ${newValues.bottomLeft}px`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-gray-100 rounded p-1">
          <button
            onClick={() => setMode('simple')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              mode === 'simple' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Simple
          </button>
          <button
            onClick={() => setMode('advanced')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              mode === 'advanced' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {mode === 'simple' ? (
        <div className="space-y-3">
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <div
              className="h-16 bg-blue-500"
              style={{ borderRadius: `${radiusValues.topLeft}px` }}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="50"
              value={radiusValues.topLeft}
              onChange={(e) => handleSimpleChange(e.target.value)}
              className="flex-1"
            />
            <input
              type="number"
              value={radiusValues.topLeft}
              onChange={(e) => handleSimpleChange(e.target.value)}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-500">px</span>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="border-2 border-gray-300 rounded-lg p-8 bg-gray-50 relative">
            <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
              <span className="text-xs text-gray-500">TL</span>
              <input
                type="number"
                value={radiusValues.topLeft}
                onChange={(e) => handleAdvancedChange('topLeft', e.target.value)}
                className="w-14 px-2 py-1 border border-gray-300 rounded text-xs text-center text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
              <span className="text-xs text-gray-500">TR</span>
              <input
                type="number"
                value={radiusValues.topRight}
                onChange={(e) => handleAdvancedChange('topRight', e.target.value)}
                className="w-14 px-2 py-1 border border-gray-300 rounded text-xs text-center text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1">
              <input
                type="number"
                value={radiusValues.bottomRight}
                onChange={(e) => handleAdvancedChange('bottomRight', e.target.value)}
                className="w-14 px-2 py-1 border border-gray-300 rounded text-xs text-center text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">BR</span>
            </div>
            <div className="absolute bottom-2 left-2 flex flex-col items-start gap-1">
              <input
                type="number"
                value={radiusValues.bottomLeft}
                onChange={(e) => handleAdvancedChange('bottomLeft', e.target.value)}
                className="w-14 px-2 py-1 border border-gray-300 rounded text-xs text-center text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">BL</span>
            </div>
            <div
              className="bg-blue-500 h-16"
              style={{
                borderTopLeftRadius: `${radiusValues.topLeft}px`,
                borderTopRightRadius: `${radiusValues.topRight}px`,
                borderBottomRightRadius: `${radiusValues.bottomRight}px`,
                borderBottomLeftRadius: `${radiusValues.bottomLeft}px`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Interactive Margin Control Component
function MarginControl({ value, onChange }) {
  const [mode, setMode] = useState('simple');
  const [marginValues, setMarginValues] = useState({ top: 20, right: 0, bottom: 20, left: 0 });

  useEffect(() => {
    if (value) {
      const parts = value.toString().replace('px', '').split(' ');
      if (parts.length === 1) {
        const val = parseInt(parts[0]) || 20;
        setMarginValues({ top: val, right: val, bottom: val, left: val });
      } else if (parts.length === 2) {
        const vertical = parseInt(parts[0]) || 20;
        const horizontal = parseInt(parts[1]) || 0;
        setMarginValues({ top: vertical, right: horizontal, bottom: vertical, left: horizontal });
      } else if (parts.length === 4) {
        setMarginValues({
          top: parseInt(parts[0]) || 20,
          right: parseInt(parts[1]) || 0,
          bottom: parseInt(parts[2]) || 20,
          left: parseInt(parts[3]) || 0,
        });
        setMode('advanced');
      }
    }
  }, [value]);

  const handleSimpleChange = (val) => {
    const numVal = parseInt(val) || 0;
    setMarginValues({ top: numVal, right: numVal, bottom: numVal, left: numVal });
    onChange(`${numVal}px`);
  };

  const handleAdvancedChange = (side, val) => {
    const numVal = parseInt(val) || 0;
    const newValues = { ...marginValues, [side]: numVal };
    setMarginValues(newValues);
    onChange(`${newValues.top}px ${newValues.right}px ${newValues.bottom}px ${newValues.left}px`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-gray-100 rounded p-1">
          <button
            onClick={() => setMode('simple')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              mode === 'simple' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Simple
          </button>
          <button
            onClick={() => setMode('advanced')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              mode === 'advanced' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {mode === 'simple' ? (
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            value={marginValues.top}
            onChange={(e) => handleSimpleChange(e.target.value)}
            className="flex-1"
          />
          <input
            type="number"
            value={marginValues.top}
            onChange={(e) => handleSimpleChange(e.target.value)}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-500">px</span>
        </div>
      ) : (
        <div className="relative">
          <div className="border-2 border-gray-300 rounded-lg p-8 bg-gray-50 relative">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <span className="text-xs text-gray-500 mb-1">Top</span>
              <input
                type="number"
                value={marginValues.top}
                onChange={(e) => handleAdvancedChange('top', e.target.value)}
                className="w-14 px-2 py-1 border border-gray-300 rounded text-xs text-center text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <span className="text-xs text-gray-500">R</span>
              <input
                type="number"
                value={marginValues.right}
                onChange={(e) => handleAdvancedChange('right', e.target.value)}
                className="w-14 px-2 py-1 border border-gray-300 rounded text-xs text-center text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <input
                type="number"
                value={marginValues.bottom}
                onChange={(e) => handleAdvancedChange('bottom', e.target.value)}
                className="w-14 px-2 py-1 border border-gray-300 rounded text-xs text-center text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500 mt-1">Bottom</span>
            </div>
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <input
                type="number"
                value={marginValues.left}
                onChange={(e) => handleAdvancedChange('left', e.target.value)}
                className="w-14 px-2 py-1 border border-gray-300 rounded text-xs text-center text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">L</span>
            </div>
            <div className="bg-purple-100 border-2 border-purple-300 rounded h-16 flex items-center justify-center">
              <span className="text-xs text-purple-600 font-medium">Margin Space</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Interactive Border Control Component
function BorderControl({ color, width, onChange }) {
  const [mode, setMode] = useState('simple'); // 'simple' or 'advanced'
  const [localColor, setLocalColor] = useState(color || '#E5E7EB');
  const [localWidth, setLocalWidth] = useState(() => {
    const parsed = parseInt(width);
    return isNaN(parsed) ? 0 : parsed;
  });
  const [borderValues, setBorderValues] = useState({
    top: { width: 0, color: '#E5E7EB' },
    right: { width: 0, color: '#E5E7EB' },
    bottom: { width: 0, color: '#E5E7EB' },
    left: { width: 0, color: '#E5E7EB' },
  });

  useEffect(() => {
    const parsed = parseInt(width);
    const numWidth = isNaN(parsed) ? 0 : parsed;
    setLocalWidth(numWidth);
    setLocalColor(color || '#E5E7EB');
    setBorderValues({
      top: { width: numWidth, color: color || '#E5E7EB' },
      right: { width: numWidth, color: color || '#E5E7EB' },
      bottom: { width: numWidth, color: color || '#E5E7EB' },
      left: { width: numWidth, color: color || '#E5E7EB' },
    });
  }, [color, width]);

  const handleSimpleColorChange = (newColor) => {
    setLocalColor(newColor);
    // If changing color and width is 0, set to 1px to make border visible
    const effectiveWidth = localWidth === 0 ? 1 : localWidth;
    if (localWidth === 0) {
      setLocalWidth(1);
    }
    onChange({ color: newColor, width: `${effectiveWidth}px` });
  };

  const handleSimpleWidthChange = (newWidth) => {
    const parsed = parseInt(newWidth);
    const numWidth = isNaN(parsed) ? 0 : parsed;
    setLocalWidth(numWidth);
    onChange({ color: localColor, width: `${numWidth}px` });
  };

  const handleAdvancedChange = (side, property, value) => {
    const newValues = {
      ...borderValues,
      [side]: {
        ...borderValues[side],
        [property]: property === 'width' ? parseInt(value) || 1 : value,
      },
    };
    setBorderValues(newValues);
    // For now, use the top border values as the main value
    onChange({
      color: newValues.top.color,
      width: `${newValues.top.width}px`
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-gray-100 rounded p-1">
          <button
            onClick={() => setMode('simple')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              mode === 'simple'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Simple
          </button>
          <button
            onClick={() => setMode('advanced')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              mode === 'advanced'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {mode === 'simple' ? (
        <div className="space-y-3">
          {/* Border Preview */}
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <div
              className="h-16 rounded bg-white flex items-center justify-center"
              style={{
                border: `${localWidth}px solid ${localColor}`,
              }}
            >
              <span className="text-xs text-gray-400">Preview</span>
            </div>
          </div>

          {/* Color Control */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={localColor}
                onChange={(e) => handleSimpleColorChange(e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={localColor}
                onChange={(e) => handleSimpleColorChange(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Width Control */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Width</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="10"
                value={localWidth}
                onChange={(e) => handleSimpleWidthChange(e.target.value)}
                className="flex-1"
              />
              <input
                type="number"
                min="0"
                value={localWidth}
                onChange={(e) => handleSimpleWidthChange(e.target.value)}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Visual Box Representation */}
          <div className="rounded-lg p-8 bg-gray-50 relative" style={{ padding: '50px' }}>
            {/* Top Border */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">Top</span>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={borderValues.top.color}
                  onChange={(e) => handleAdvancedChange('top', 'color', e.target.value)}
                  className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="number"
                  value={borderValues.top.width}
                  onChange={(e) => handleAdvancedChange('top', 'width', e.target.value)}
                  min="1"
                  max="10"
                  className="w-12 px-1 py-1 border border-gray-300 rounded text-xs text-center text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>

            {/* Right Border */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">Right</span>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={borderValues.right.color}
                  onChange={(e) => handleAdvancedChange('right', 'color', e.target.value)}
                  className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="number"
                  value={borderValues.right.width}
                  onChange={(e) => handleAdvancedChange('right', 'width', e.target.value)}
                  min="1"
                  max="10"
                  className="w-12 px-1 py-1 border border-gray-300 rounded text-xs text-center text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>

            {/* Bottom Border */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={borderValues.bottom.color}
                  onChange={(e) => handleAdvancedChange('bottom', 'color', e.target.value)}
                  className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="number"
                  value={borderValues.bottom.width}
                  onChange={(e) => handleAdvancedChange('bottom', 'width', e.target.value)}
                  min="1"
                  max="10"
                  className="w-12 px-1 py-1 border border-gray-300 rounded text-xs text-center text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
              <span className="text-xs text-gray-500">Bottom</span>
            </div>

            {/* Left Border */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">Left</span>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={borderValues.left.color}
                  onChange={(e) => handleAdvancedChange('left', 'color', e.target.value)}
                  className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="number"
                  value={borderValues.left.width}
                  onChange={(e) => handleAdvancedChange('left', 'width', e.target.value)}
                  min="1"
                  max="10"
                  className="w-12 px-1 py-1 border border-gray-300 rounded text-xs text-center text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>

            {/* Center Content with actual borders */}
            <div
              className="bg-white rounded h-20 flex items-center justify-center"
              style={{
                borderTop: `${borderValues.top.width}px solid ${borderValues.top.color}`,
                borderRight: `${borderValues.right.width}px solid ${borderValues.right.color}`,
                borderBottom: `${borderValues.bottom.width}px solid ${borderValues.bottom.color}`,
                borderLeft: `${borderValues.left.width}px solid ${borderValues.left.color}`,
              }}
            >
              <span className="text-xs text-gray-500 font-medium">Content</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RightPanel() {
  const dispatch = useDispatch();
  const { selectedComponentId, components } = useSelector(
    (state) => state.emailBuilder
  );

  const selectedComponent = selectedComponentId
    ? findComponentById(components, selectedComponentId)
    : null;

  const [localProps, setLocalProps] = useState({});
  const contentEditableRef = useRef(null);

  useEffect(() => {
    if (selectedComponent) {
      setLocalProps({ ...selectedComponent.props });
      // Update contentEditable only when component changes, not on every edit
      if (contentEditableRef.current && selectedComponent.type === COMPONENT_TYPES.TEXT) {
        if (document.activeElement !== contentEditableRef.current) {
          contentEditableRef.current.innerHTML = selectedComponent.props.content || '';
        }
      }
    }
  }, [selectedComponent]);

  const handlePropertyChange = (propName, value) => {
    setLocalProps((prev) => ({ ...prev, [propName]: value }));

    // Special handling for column width changes - auto-adjust sibling columns
    if (propName === 'width' && selectedComponent.type === COMPONENT_TYPES.COLUMN) {
      const parentRow = findParentComponent(components, selectedComponentId);

      // Update the current column
      dispatch(
        updateComponent({
          componentId: selectedComponentId,
          updates: {
            props: {
              ...selectedComponent.props,
              [propName]: value,
            },
          },
        })
      );

      // Redistribute width among sibling columns
      const siblingUpdates = redistributeColumnWidths(parentRow, selectedComponentId, value);
      if (siblingUpdates) {
        Object.entries(siblingUpdates).forEach(([columnId, newWidth]) => {
          const siblingColumn = findComponentById(components, columnId);
          if (siblingColumn) {
            dispatch(
              updateComponent({
                componentId: columnId,
                updates: {
                  props: {
                    ...siblingColumn.props,
                    width: newWidth,
                  },
                },
              })
            );
          }
        });
      }
    } else {
      // Normal property change for non-column-width properties
      dispatch(
        updateComponent({
          componentId: selectedComponentId,
          updates: {
            props: {
              ...selectedComponent.props,
              [propName]: value,
            },
          },
        })
      );
    }
  };

  if (!selectedComponent) {
    return (
      <div className="w-full h-full bg-gray-50 border-l border-gray-200 p-4">
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <svg
            className="w-12 h-12 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          <p className="text-sm font-medium">No Component Selected</p>
          <p className="text-xs mt-1">Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const renderPropertyInputs = () => {
    const { type, props } = selectedComponent;

    switch (type) {
      case COMPONENT_TYPES.TEXT:
        return (
          <>
            <PropertyGroup label="Text Content">
              <div className="space-y-2">
                {/* Rich Text Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border border-gray-300 rounded-t">
                  {/* Text Formatting */}
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      contentEditableRef.current?.focus();
                      document.execCommand('bold', false, null);
                    }}
                    className="px-3 py-1.5 text-sm font-bold border border-gray-300 rounded bg-white hover:bg-gray-100 text-gray-700"
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      contentEditableRef.current?.focus();
                      document.execCommand('italic', false, null);
                    }}
                    className="px-3 py-1.5 text-sm italic border border-gray-300 rounded bg-white hover:bg-gray-100 text-gray-700"
                    title="Italic"
                  >
                    I
                  </button>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      contentEditableRef.current?.focus();
                      document.execCommand('underline', false, null);
                    }}
                    className="px-3 py-1.5 text-sm underline border border-gray-300 rounded bg-white hover:bg-gray-100 text-gray-700"
                    title="Underline"
                  >
                    U
                  </button>

                  <div className="w-px h-5 bg-gray-300 mx-1"></div>

                  {/* Text Alignment */}
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      contentEditableRef.current?.focus();
                      document.execCommand('justifyLeft', false, null);
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 flex items-center justify-center"
                    title="Align Left"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                  </button>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      contentEditableRef.current?.focus();
                      document.execCommand('justifyCenter', false, null);
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 flex items-center justify-center"
                    title="Align Center"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                  </button>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      contentEditableRef.current?.focus();
                      document.execCommand('justifyRight', false, null);
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 flex items-center justify-center"
                    title="Align Right"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                  </button>

                  <div className="w-px h-5 bg-gray-300 mx-1"></div>

                  {/* Lists */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      if (contentEditableRef.current) {
                        contentEditableRef.current.focus();
                        const selection = window.getSelection();
                        if (selection && selection.rangeCount === 0 && contentEditableRef.current.childNodes.length > 0) {
                          // If no selection, create one at the end
                          const range = document.createRange();
                          range.selectNodeContents(contentEditableRef.current);
                          range.collapse(false);
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        document.execCommand('insertUnorderedList', false, null);
                      }
                    }}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100 text-gray-700"
                    title="Bullet List"
                  >
                    • List
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      if (contentEditableRef.current) {
                        contentEditableRef.current.focus();
                        const selection = window.getSelection();
                        if (selection && selection.rangeCount === 0 && contentEditableRef.current.childNodes.length > 0) {
                          // If no selection, create one at the end
                          const range = document.createRange();
                          range.selectNodeContents(contentEditableRef.current);
                          range.collapse(false);
                          selection.removeAllRanges();
                          selection.addRange(range);
                        }
                        document.execCommand('insertOrderedList', false, null);
                      }
                    }}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100 text-gray-700"
                    title="Numbered List"
                  >
                    1. List
                  </button>

                  <div className="w-px h-5 bg-gray-300 mx-1"></div>

                  {/* Font Size */}
                  <select
                    onChange={(e) => {
                      contentEditableRef.current?.focus();
                      document.execCommand('fontSize', false, e.target.value);
                    }}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100 text-gray-700"
                    defaultValue="3"
                  >
                    <option value="1">Tiny</option>
                    <option value="2">Small</option>
                    <option value="3">Normal</option>
                    <option value="4">Medium</option>
                    <option value="5">Large</option>
                    <option value="6">Huge</option>
                  </select>

                  <div className="w-px h-5 bg-gray-300 mx-1"></div>

                  {/* Text Color */}
                  <div className="relative inline-flex items-center">
                    <input
                      type="color"
                      onChange={(e) => {
                        contentEditableRef.current?.focus();
                        document.execCommand('foreColor', false, e.target.value);
                      }}
                      className="w-8 h-8 border border-gray-300 rounded bg-white cursor-pointer"
                      title="Text Color"
                      defaultValue="#000000"
                    />
                    <span className="absolute bottom-0 left-0 right-0 text-xs text-center text-gray-600 pointer-events-none" style={{ fontSize: '8px' }}>
                      A
                    </span>
                  </div>

                  {/* Background Color */}
                  <div className="relative inline-flex items-center">
                    <input
                      type="color"
                      onChange={(e) => {
                        contentEditableRef.current?.focus();
                        document.execCommand('backColor', false, e.target.value);
                      }}
                      className="w-8 h-8 border border-gray-300 rounded bg-white cursor-pointer"
                      title="Background Color"
                      defaultValue="#ffffff"
                    />
                    <span className="absolute bottom-0 left-0 right-0 text-xs text-center text-gray-600 pointer-events-none" style={{ fontSize: '8px' }}>
                      BG
                    </span>
                  </div>

                  <div className="w-px h-5 bg-gray-300 mx-1"></div>

                  {/* Link */}
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const url = prompt('Enter URL:');
                      if (url) {
                        contentEditableRef.current?.focus();
                        document.execCommand('createLink', false, url);
                      }
                    }}
                    className="px-3 py-1.5 text-base border border-gray-300 rounded bg-white hover:bg-gray-100"
                    title="Link"
                  >
                    🔗
                  </button>
                </div>

                {/* Editable Content Area */}
                <div
                  ref={contentEditableRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => {
                    // Update as you type without re-rendering
                    handlePropertyChange('content', e.currentTarget.innerHTML);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-b text-sm text-gray-900 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] max-h-[300px] overflow-y-auto"
                  style={{
                    fontSize: `${localProps.fontSize || 14}px`,
                    color: localProps.color || '#000000',
                    fontFamily: localProps.fontFamily || 'Arial, sans-serif',
                  }}
                />
              </div>
            </PropertyGroup>

            <PropertyGroup label="Font Size">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="8"
                  max="48"
                  value={localProps.fontSize || 14}
                  onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  value={localProps.fontSize || 14}
                  onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </PropertyGroup>

            <PropertyGroup label="Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={localProps.color || '#000000'}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={localProps.color || '#000000'}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </PropertyGroup>

            <PropertyGroup label="Font Family">
              <select
                value={localProps.fontFamily || 'Arial, sans-serif'}
                onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="Verdana, sans-serif">Verdana</option>
                <option value="Helvetica, sans-serif">Helvetica</option>
              </select>
            </PropertyGroup>

            <PropertyGroup label="Text Align">
              <div className="flex gap-2">
                {['left', 'center', 'right', 'justify'].map((align) => (
                  <button
                    key={align}
                    onClick={() => handlePropertyChange('textAlign', align)}
                    className={`flex-1 px-3 py-2 border rounded text-xs transition-colors ${
                      localProps.textAlign === align
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </button>
                ))}
              </div>
            </PropertyGroup>

            <PropertyGroup label="Padding">
              <PaddingControl
                value={localProps.padding || '10px'}
                onChange={(value) => handlePropertyChange('padding', value)}
              />
            </PropertyGroup>

            <PropertyGroup label="Border">
              <BorderControl
                color={localProps.borderColor || '#E5E7EB'}
                width={localProps.borderWidth || '0px'}
                onChange={({ color, width }) => {
                  // Update both properties at once
                  setLocalProps((prev) => ({
                    ...prev,
                    borderColor: color,
                    borderWidth: width,
                  }));
                  dispatch(
                    updateComponent({
                      componentId: selectedComponentId,
                      props: {
                        borderColor: color,
                        borderWidth: width,
                      },
                    })
                  );
                }}
              />
            </PropertyGroup>
          </>
        );

      case COMPONENT_TYPES.HEADING:
        return (
          <>
            <PropertyGroup label="Heading Content">
              <input
                type="text"
                value={localProps.content || ''}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter heading text..."
              />
            </PropertyGroup>

            <PropertyGroup label="Heading Level">
              <select
                value={localProps.level || 'h2'}
                onChange={(e) => handlePropertyChange('level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="h1">H1 - Largest</option>
                <option value="h2">H2 - Large</option>
                <option value="h3">H3 - Medium</option>
                <option value="h4">H4 - Small</option>
                <option value="h5">H5 - Smaller</option>
                <option value="h6">H6 - Smallest</option>
              </select>
            </PropertyGroup>

            <PropertyGroup label="Font Size">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="12"
                  max="64"
                  value={localProps.fontSize || 24}
                  onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  value={localProps.fontSize || 24}
                  onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </PropertyGroup>

            <PropertyGroup label="Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={localProps.color || '#000000'}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={localProps.color || '#000000'}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </PropertyGroup>

            <PropertyGroup label="Text Align">
              <div className="flex gap-2">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    onClick={() => handlePropertyChange('textAlign', align)}
                    className={`flex-1 px-3 py-2 border rounded text-xs transition-colors ${
                      localProps.textAlign === align
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </button>
                ))}
              </div>
            </PropertyGroup>

            <PropertyGroup label="Padding">
              <PaddingControl
                value={localProps.padding || '10px'}
                onChange={(value) => handlePropertyChange('padding', value)}
              />
            </PropertyGroup>

            <PropertyGroup label="Border">
              <BorderControl
                color={localProps.borderColor || '#E5E7EB'}
                width={localProps.borderWidth || '0px'}
                onChange={({ color, width }) => {
                  // Update both properties at once
                  setLocalProps((prev) => ({
                    ...prev,
                    borderColor: color,
                    borderWidth: width,
                  }));
                  dispatch(
                    updateComponent({
                      componentId: selectedComponentId,
                      props: {
                        borderColor: color,
                        borderWidth: width,
                      },
                    })
                  );
                }}
              />
            </PropertyGroup>
          </>
        );

      case COMPONENT_TYPES.BUTTON:
        return (
          <>
            <PropertyGroup label="Button Text">
              <input
                type="text"
                value={localProps.text || ''}
                onChange={(e) => handlePropertyChange('text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Button label..."
              />
            </PropertyGroup>

            <PropertyGroup label="Link URL">
              <input
                type="text"
                value={localProps.href || '#'}
                onChange={(e) => handlePropertyChange('href', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </PropertyGroup>

            <PropertyGroup label="Background Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={localProps.backgroundColor || '#2563EB'}
                  onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={localProps.backgroundColor || '#2563EB'}
                  onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </PropertyGroup>

            <PropertyGroup label="Text Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={localProps.color || '#FFFFFF'}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={localProps.color || '#FFFFFF'}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </PropertyGroup>

            <PropertyGroup label="Padding">
              <PaddingControl
                value={localProps.padding || '12px 24px'}
                onChange={(value) => handlePropertyChange('padding', value)}
              />
            </PropertyGroup>

            <PropertyGroup label="Border Radius">
              <BorderRadiusControl
                value={localProps.borderRadius || '4px'}
                onChange={(value) => handlePropertyChange('borderRadius', value)}
              />
            </PropertyGroup>

            <PropertyGroup label="Border">
              <BorderControl
                color={localProps.borderColor || '#E5E7EB'}
                width={localProps.borderWidth || '0px'}
                onChange={({ color, width }) => {
                  // Update both properties at once
                  setLocalProps((prev) => ({
                    ...prev,
                    borderColor: color,
                    borderWidth: width,
                  }));
                  dispatch(
                    updateComponent({
                      componentId: selectedComponentId,
                      props: {
                        borderColor: color,
                        borderWidth: width,
                      },
                    })
                  );
                }}
              />
            </PropertyGroup>

            <PropertyGroup label="Alignment">
              <div className="flex gap-2">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    onClick={() => handlePropertyChange('textAlign', align)}
                    className={`flex-1 px-3 py-2 border rounded text-xs transition-colors ${
                      localProps.textAlign === align
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </button>
                ))}
              </div>
            </PropertyGroup>
          </>
        );

      case COMPONENT_TYPES.IMAGE:
        return (
          <>
            <PropertyGroup label="Image URL">
              <input
                type="text"
                value={localProps.src || ''}
                onChange={(e) => handlePropertyChange('src', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </PropertyGroup>

            <PropertyGroup label="Image Gallery">
              <ImageGallery
                onSelectImage={(imageUrl) => handlePropertyChange('src', imageUrl)}
              />
            </PropertyGroup>

            <PropertyGroup label="Alt Text">
              <input
                type="text"
                value={localProps.alt || 'Image'}
                onChange={(e) => handlePropertyChange('alt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Image description..."
              />
            </PropertyGroup>

            <PropertyGroup label="Width">
              <input
                type="text"
                value={localProps.width || '100%'}
                onChange={(e) => handlePropertyChange('width', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 100% or 300px"
              />
            </PropertyGroup>

            <PropertyGroup label="Height">
              <input
                type="text"
                value={localProps.height || 'auto'}
                onChange={(e) => handlePropertyChange('height', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., auto or 200px"
              />
            </PropertyGroup>

            <PropertyGroup label="Border">
              <BorderControl
                color={localProps.borderColor || '#E5E7EB'}
                width={localProps.borderWidth || '0px'}
                onChange={({ color, width }) => {
                  // Update both properties at once
                  setLocalProps((prev) => ({
                    ...prev,
                    borderColor: color,
                    borderWidth: width,
                  }));
                  dispatch(
                    updateComponent({
                      componentId: selectedComponentId,
                      props: {
                        borderColor: color,
                        borderWidth: width,
                      },
                    })
                  );
                }}
              />
            </PropertyGroup>
          </>
        );

      case COMPONENT_TYPES.DIVIDER:
        return (
          <>
            <PropertyGroup label="Border">
              <BorderControl
                color={localProps.borderColor || '#E5E7EB'}
                width={localProps.borderWidth || '1px'}
                onChange={({ color, width }) => {
                  handlePropertyChange('borderColor', color);
                  handlePropertyChange('borderWidth', width);
                }}
              />
            </PropertyGroup>

            <PropertyGroup label="Margin">
              <MarginControl
                value={localProps.margin || '20px 0'}
                onChange={(value) => handlePropertyChange('margin', value)}
              />
            </PropertyGroup>
          </>
        );

      case COMPONENT_TYPES.SPACER:
        return (
          <>
            <PropertyGroup label="Height">
              <input
                type="text"
                value={localProps.height || '20px'}
                onChange={(e) => handlePropertyChange('height', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 20px"
              />
            </PropertyGroup>
          </>
        );

      case COMPONENT_TYPES.SECTION:
        return (
          <>
            <PropertyGroup label="Background Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={localProps.backgroundColor || '#FFFFFF'}
                  onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={localProps.backgroundColor || '#FFFFFF'}
                  onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </PropertyGroup>

            <PropertyGroup label="Padding">
              <PaddingControl
                value={localProps.padding || '20px'}
                onChange={(value) => handlePropertyChange('padding', value)}
              />
            </PropertyGroup>

            <PropertyGroup label="Border">
              <BorderControl
                color={localProps.borderColor || '#E5E7EB'}
                width={localProps.borderWidth || '0px'}
                onChange={({ color, width }) => {
                  // Update both properties at once
                  setLocalProps((prev) => ({
                    ...prev,
                    borderColor: color,
                    borderWidth: width,
                  }));
                  dispatch(
                    updateComponent({
                      componentId: selectedComponentId,
                      props: {
                        borderColor: color,
                        borderWidth: width,
                      },
                    })
                  );
                }}
              />
            </PropertyGroup>
          </>
        );

      case COMPONENT_TYPES.CONTAINER:
        return (
          <>
            <PropertyGroup label="Max Width">
              <input
                type="text"
                value={localProps.maxWidth || '600px'}
                onChange={(e) => handlePropertyChange('maxWidth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 600px"
              />
            </PropertyGroup>

            <PropertyGroup label="Padding">
              <PaddingControl
                value={localProps.padding || '20px'}
                onChange={(value) => handlePropertyChange('padding', value)}
              />
            </PropertyGroup>

            <PropertyGroup label="Border">
              <BorderControl
                color={localProps.borderColor || '#E5E7EB'}
                width={localProps.borderWidth || '0px'}
                onChange={({ color, width }) => {
                  // Update both properties at once
                  setLocalProps((prev) => ({
                    ...prev,
                    borderColor: color,
                    borderWidth: width,
                  }));
                  dispatch(
                    updateComponent({
                      componentId: selectedComponentId,
                      props: {
                        borderColor: color,
                        borderWidth: width,
                      },
                    })
                  );
                }}
              />
            </PropertyGroup>
          </>
        );

      case COMPONENT_TYPES.ROW:
        return (
          <>
            <PropertyGroup label="Background Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={localProps.backgroundColor || '#FFFFFF'}
                  onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={localProps.backgroundColor || '#FFFFFF'}
                  onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </PropertyGroup>

            <PropertyGroup label="Padding">
              <PaddingControl
                value={localProps.padding || '10px'}
                onChange={(value) => handlePropertyChange('padding', value)}
              />
            </PropertyGroup>

            <PropertyGroup label="Border">
              <BorderControl
                color={localProps.borderColor || '#E5E7EB'}
                width={localProps.borderWidth || '0px'}
                onChange={({ color, width }) => {
                  // Update both properties at once
                  setLocalProps((prev) => ({
                    ...prev,
                    borderColor: color,
                    borderWidth: width,
                  }));
                  dispatch(
                    updateComponent({
                      componentId: selectedComponentId,
                      props: {
                        borderColor: color,
                        borderWidth: width,
                      },
                    })
                  );
                }}
              />
            </PropertyGroup>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs text-blue-700">
                💡 Select individual columns to adjust their width
              </p>
            </div>
          </>
        );

      case COMPONENT_TYPES.COLUMN:
        return (
          <>
            <PropertyGroup label="Column Width">
              <div className="space-y-3">
                <div className="flex gap-2">
                  {['25%', '33.33%', '50%', '66.67%', '75%', '100%'].map((w) => (
                    <button
                      key={w}
                      onClick={() => handlePropertyChange('width', w)}
                      className={`flex-1 px-2 py-2 border rounded text-xs transition-colors ${
                        localProps.width === w
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={localProps.width || '100%'}
                    onChange={(e) => handlePropertyChange('width', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 50% or 300px"
                  />
                </div>
              </div>
            </PropertyGroup>

            <PropertyGroup label="Background Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={localProps.backgroundColor || 'transparent'}
                  onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={localProps.backgroundColor || 'transparent'}
                  onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </PropertyGroup>

            <PropertyGroup label="Padding">
              <PaddingControl
                value={localProps.padding || '10px'}
                onChange={(value) => handlePropertyChange('padding', value)}
              />
            </PropertyGroup>

            <PropertyGroup label="Border">
              <BorderControl
                color={localProps.borderColor || '#E5E7EB'}
                width={localProps.borderWidth || '0px'}
                onChange={({ color, width }) => {
                  // Update both properties at once
                  setLocalProps((prev) => ({
                    ...prev,
                    borderColor: color,
                    borderWidth: width,
                  }));
                  dispatch(
                    updateComponent({
                      componentId: selectedComponentId,
                      props: {
                        borderColor: color,
                        borderWidth: width,
                      },
                    })
                  );
                }}
              />
            </PropertyGroup>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs text-blue-700 font-medium mb-1">✨ Auto-Adjustment Enabled</p>
              <p className="text-xs text-blue-600 mb-2">When you change this column's width, other columns in the row will automatically adjust to fill the remaining space proportionally.</p>
              <p className="text-xs text-blue-700 font-medium mb-1">Quick Width Presets:</p>
              <p className="text-xs text-blue-600">• 50% = Half width • 33.33% = One-third</p>
              <p className="text-xs text-blue-600">• 25% = Quarter • 75% = Three-quarters</p>
            </div>
          </>
        );

      default:
        return (
          <div className="text-center text-gray-500 text-sm py-8">
            No properties available for this component type.
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          Properties
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1)} Component
        </p>
      </div>

      {/* Properties */}
      <div className="p-4 space-y-4">{renderPropertyInputs()}</div>
    </div>
  );
}

// Property Group Component
function PropertyGroup({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
