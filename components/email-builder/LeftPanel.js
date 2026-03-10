'use client';

import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAlignLeft,
  faHeading,
  faSquare,
  faImage,
  faMinus,
  faArrowsUpDown
} from '@fortawesome/free-solid-svg-icons';
import { BASIC_COMPONENTS, COLUMN_COMPONENTS, CONTAINER_COMPONENTS } from './componentLibrary';

// Icon mapping
const iconMap = {
  faAlignLeft,
  faHeading,
  faSquare,
  faImage,
  faMinus,
  faArrowsUpDown,
};

function DraggableComponent({ component }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: component.id,
    data: {
      component,
      isNew: true,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  // Check if it's a column layout component (ROW type)
  const isColumnLayout = component.type === 'row' && component.children;

  if (isColumnLayout) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="component-card bg-white border border-gray-200 rounded-lg p-2 cursor-move hover:border-blue-400 hover:shadow-lg transition-all col-span-3"
      >
        {/* Column Layout Visual */}
        <div className="flex gap-0.5 h-6">
          {component.children.map((col, index) => (
            <div
              key={index}
              className="bg-blue-100 border border-blue-300 rounded flex items-center justify-center"
              style={{
                flex: `0 0 ${col.defaultProps.width}`,
                minWidth: 0
              }}
            >
              <span className="text-xs text-blue-600 font-medium">
                {col.defaultProps.width}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Regular component with icon
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="component-card bg-white border border-gray-200 rounded-lg p-2 cursor-move hover:border-blue-400 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-1.5 aspect-square"
    >
      <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg">
        {iconMap[component.icon] ? (
          <FontAwesomeIcon icon={iconMap[component.icon]} className="text-lg text-blue-600" />
        ) : (
          <span className="text-lg">{component.icon}</span>
        )}
      </div>
      <p className="text-xs font-medium text-gray-700 text-center leading-tight">{component.name}</p>
    </div>
  );
}

function ComponentSection({ title, components, bgColor, isOpen, onToggle }) {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
      >
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {title}
        </h3>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-2 p-2 grid grid-cols-3 gap-x-1.5 gap-y-1" style={{ backgroundColor: bgColor }}>
          {components.map((component) => (
            <DraggableComponent key={component.id} component={component} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LeftPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState({
    basic: true,
    columns: true,
    containers: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const filterComponents = (components) => {
    if (!searchQuery) return components;
    return components.filter((comp) =>
      comp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="w-full h-full bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Components</h2>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Component Sections */}
        <div>
          <ComponentSection
            title="Basic Components"
            components={filterComponents(BASIC_COMPONENTS)}
            bgColor="#F0F7FF"
            isOpen={openSections.basic}
            onToggle={() => toggleSection('basic')}
          />

          <ComponentSection
            title="Column Layouts"
            components={filterComponents(COLUMN_COMPONENTS)}
            bgColor="#F0FDF4"
            isOpen={openSections.columns}
            onToggle={() => toggleSection('columns')}
          />

          <ComponentSection
            title="Containers"
            components={filterComponents(CONTAINER_COMPONENTS)}
            bgColor="#FAF5FF"
            isOpen={openSections.containers}
            onToggle={() => toggleSection('containers')}
          />
        </div>
      </div>
    </div>
  );
}
