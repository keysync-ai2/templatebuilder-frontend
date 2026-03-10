'use client';

import { useDispatch, useSelector } from 'react-redux';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import LeftPanel from './LeftPanel';
import Canvas from './Canvas';
import RightPanel from './RightPanel';
import TemplateRenderer from './TemplateRenderer';
import { addRow, addColumn, moveRow, updateTemplateMeta, setTemplate } from '@/store/slices/templateBuilderSlice';

export default function TemplateBuilder() {
  const dispatch = useDispatch();
  const template = useSelector((state) => state.templateBuilder.template);
  const [activeId, setActiveId] = useState(null);
  const [showHTMLPreview, setShowHTMLPreview] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    // Handle dropping component from left panel
    if (active.id === 'column-1x1' || active.id === 'column-1x2' || active.id === 'column-1x3' ||
        active.id === 'text' || active.id === 'image' || active.id === 'button') {

      const componentType = active.id;

      // Create a new row with columns based on dropped component
      if (componentType.startsWith('column-')) {
        const colCount = parseInt(componentType.split('x')[1]);
        dispatch(addRow({ name: `${colCount} Column Row` }));

        // Add columns to the newly created row
        setTimeout(() => {
          const rows = template.data.body;
          const newRow = rows[rows.length - 1];
          for (let i = 0; i < colCount; i++) {
            dispatch(addColumn({ rowId: newRow.RowID, columnType: 'Text' }));
          }
        }, 100);
      } else {
        // Add single component
        const typeMap = {
          'text': 'Text',
          'image': 'Image',
          'button': 'Button'
        };
        dispatch(addRow({ name: `${typeMap[componentType]} Row` }));
        setTimeout(() => {
          const rows = template.data.body;
          const newRow = rows[rows.length - 1];
          dispatch(addColumn({ rowId: newRow.RowID, columnType: typeMap[componentType] }));
        }, 100);
      }
    }

    // Handle row reordering
    if (active.id !== over.id && active.id.startsWith('Row-') && over.id.startsWith('Row-')) {
      const rows = template.data.body;
      const oldIndex = rows.findIndex(r => r.RowID === active.id);
      const newIndex = rows.findIndex(r => r.RowID === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch(moveRow({ fromIndex: oldIndex, toIndex: newIndex }));
      }
    }

    setActiveId(null);
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(template, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name || 'template'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result);
        dispatch(setTemplate(json));
        alert('Template imported successfully!');
      } catch (error) {
        alert('Error importing template: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-gray-950">
        {/* Top Bar */}
        <div className="bg-gray-900 border-b border-gray-800 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                type="text"
                value={template.name}
                onChange={(e) => dispatch(updateTemplateMeta({ name: e.target.value }))}
                className="text-lg font-bold bg-transparent text-gray-100 border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                placeholder="Template Name"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHTMLPreview(!showHTMLPreview)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-100 rounded-lg text-sm"
              >
                {showHTMLPreview ? 'Hide' : 'Show'} HTML
              </button>
              <label className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm cursor-pointer">
                Import JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleExportJSON}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
              >
                Export JSON
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <LeftPanel />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Canvas />
            {showHTMLPreview && (
              <div className="border-t border-gray-800 bg-gray-900 p-4 overflow-y-auto max-h-64">
                <TemplateRenderer template={template} />
              </div>
            )}
          </div>
          <RightPanel />
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg opacity-75">
            Dragging {activeId}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
