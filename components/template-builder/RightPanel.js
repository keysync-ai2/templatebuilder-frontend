'use client';

import { useSelector, useDispatch } from 'react-redux';
import { updateColumn, updateColumnStyle, updateRow } from '@/store/slices/templateBuilderSlice';
import { useState } from 'react';

export default function RightPanel() {
  const dispatch = useDispatch();
  const selectedElement = useSelector((state) => state.templateBuilder.selectedElement);
  const template = useSelector((state) => state.templateBuilder.template);

  const [activeTab, setActiveTab] = useState('styles');

  if (!selectedElement) {
    return (
      <div className="w-1/4 bg-gray-900 border-l border-gray-800 p-4">
        <div className="flex items-center justify-center h-full text-gray-500 text-center">
          <p>Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  let element = null;
  if (selectedElement.type === 'column') {
    const row = template.data.body.find(r => r.RowID === selectedElement.rowId);
    element = row?.Columns.find(c => c.ColumnID === selectedElement.id);
  } else if (selectedElement.type === 'row') {
    element = template.data.body.find(r => r.RowID === selectedElement.id);
  }

  if (!element) {
    return (
      <div className="w-1/4 bg-gray-900 border-l border-gray-800 p-4">
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Element not found</p>
        </div>
      </div>
    );
  }

  const handleStyleChange = (property, value) => {
    if (selectedElement.type === 'column') {
      dispatch(updateColumnStyle({
        rowId: selectedElement.rowId,
        columnId: selectedElement.id,
        styleUpdates: { [property]: value }
      }));
    }
  };

  const handlePaddingChange = (side, value) => {
    if (selectedElement.type === 'column' && element.Style) {
      const newPadding = { ...element.Style.padding, [side]: parseInt(value) || 0 };
      dispatch(updateColumnStyle({
        rowId: selectedElement.rowId,
        columnId: selectedElement.id,
        styleUpdates: { padding: newPadding }
      }));
    }
  };

  const handleContentChange = (property, value) => {
    if (selectedElement.type === 'column') {
      dispatch(updateColumn({
        rowId: selectedElement.rowId,
        columnId: selectedElement.id,
        updates: { [property]: value }
      }));
    } else if (selectedElement.type === 'row') {
      dispatch(updateRow({
        rowId: selectedElement.id,
        updates: { [property]: value }
      }));
    }
  };

  return (
    <div className="w-1/4 bg-gray-900 border-l border-gray-800 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold text-gray-100">Properties</h2>
        <p className="text-xs text-gray-500 mt-1">
          {selectedElement.type === 'column' ? element.Type : 'Row'} Element
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'content'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab('styles')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'styles'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Styles
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'content' && (
          <>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={element.Name || ''}
                onChange={(e) => handleContentChange('Name', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={element.Description || ''}
                onChange={(e) => handleContentChange('Description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Type-specific content */}
            {selectedElement.type === 'column' && element.Type === 'Text' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Text Content</label>
                <textarea
                  value={element.Text || ''}
                  onChange={(e) => handleContentChange('Text', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {selectedElement.type === 'column' && element.Type === 'Image' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <input
                  type="text"
                  value={element.Image || ''}
                  onChange={(e) => handleContentChange('Image', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {element.Image && (
                  <img src={element.Image} alt="Preview" className="mt-2 w-full rounded" />
                )}
              </div>
            )}

            {selectedElement.type === 'column' && element.Type === 'Button' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Button Text</label>
                  <input
                    type="text"
                    value={element.Text || ''}
                    onChange={(e) => handleContentChange('Text', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Link URL</label>
                  <input
                    type="text"
                    value={element.URL || ''}
                    onChange={(e) => handleContentChange('URL', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'styles' && selectedElement.type === 'column' && element.Style && (
          <>
            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={element.Style.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={element.Style.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={element.Style.color || '#000000'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={element.Style.color || '#000000'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Font Family</label>
              <select
                value={element.Style.fontFamily || 'Arial, sans-serif'}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="Verdana, sans-serif">Verdana</option>
              </select>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Font Size (px)</label>
              <input
                type="number"
                value={element.Style.fontSize || 16}
                onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Text Align */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Text Align</label>
              <div className="grid grid-cols-3 gap-2">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    onClick={() => handleStyleChange('textAlign', align)}
                    className={`px-3 py-2 rounded text-sm ${
                      element.Style.textAlign === align
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>

            {/* Padding */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Padding (px)</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500">Top</label>
                  <input
                    type="number"
                    value={element.Style.padding?.top || 0}
                    onChange={(e) => handlePaddingChange('top', e.target.value)}
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-100 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Bottom</label>
                  <input
                    type="number"
                    value={element.Style.padding?.bottom || 0}
                    onChange={(e) => handlePaddingChange('bottom', e.target.value)}
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-100 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Left</label>
                  <input
                    type="number"
                    value={element.Style.padding?.left || 0}
                    onChange={(e) => handlePaddingChange('left', e.target.value)}
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-100 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Right</label>
                  <input
                    type="number"
                    value={element.Style.padding?.right || 0}
                    onChange={(e) => handlePaddingChange('right', e.target.value)}
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-100 text-sm"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
