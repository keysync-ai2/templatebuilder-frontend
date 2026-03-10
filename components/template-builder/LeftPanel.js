'use client';

import { useDraggable } from '@dnd-kit/core';

function DraggableComponent({ id, type, icon, label }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { type },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-move hover:bg-gray-750 hover:border-blue-500 transition-all mb-3"
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <h3 className="text-sm font-semibold text-gray-100">{label}</h3>
          <p className="text-xs text-gray-500">Drag to canvas</p>
        </div>
      </div>
    </div>
  );
}

export default function LeftPanel() {
  const components = [
    { id: 'column-1x1', type: 'column', icon: '▯', label: '1 Column', cols: 1 },
    { id: 'column-1x2', type: 'column', icon: '▯▯', label: '2 Columns', cols: 2 },
    { id: 'column-1x3', type: 'column', icon: '▯▯▯', label: '3 Columns', cols: 3 },
    { id: 'text', type: 'text', icon: '📝', label: 'Text' },
    { id: 'image', type: 'image', icon: '🖼️', label: 'Image' },
    { id: 'button', type: 'button', icon: '🔘', label: 'Button' },
  ];

  return (
    <div className="w-1/4 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-100 mb-4">Components</h2>
      <div className="space-y-2">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Layout
          </h3>
          {components.filter(c => c.type === 'column').map((component) => (
            <DraggableComponent
              key={component.id}
              id={component.id}
              type={component.type}
              icon={component.icon}
              label={component.label}
            />
          ))}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Content
          </h3>
          {components.filter(c => c.type !== 'column').map((component) => (
            <DraggableComponent
              key={component.id}
              id={component.id}
              type={component.type}
              icon={component.icon}
              label={component.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
