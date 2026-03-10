'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useSortable, SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { COMPONENT_TYPES } from './componentLibrary';
import { removeComponent, duplicateComponent, selectComponent } from '@/store/slices/emailBuilderSlice';
import { useState } from 'react';

// Combined Sortable & Droppable Column Component
function SortableColumnWrapper({ column, parentId, selectedComponentId, onSelectComponent }) {
  const dispatch = useDispatch();

  // Make column sortable (for drag-and-drop between rows)
  const { attributes, listeners, setNodeRef: setSortableRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      parentId: parentId,
    },
  });

  // Make column droppable (for accepting components inside)
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      parentId: parentId,
      columnId: column.id,
    },
  });

  const childIds = column.children ? column.children.map((c) => c.id) : [];
  const isSelected = selectedComponentId === column.id;

  // Merge refs so both sortable and droppable work
  const setNodeRef = (node) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(removeComponent(column.id));
  };

  const handleDuplicate = (e) => {
    e.stopPropagation();
    dispatch(duplicateComponent(column.id));
  };

  return (
    <div
      ref={setNodeRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelectComponent(column.id);
      }}
      {...attributes}
      className="relative group"
      style={{
        width: '100%',
        height: '100%',
        minHeight: column.children && column.children.length > 0 ? 'auto' : '120px',
        padding: column.props.padding || '12px',
        backgroundColor: column.props.backgroundColor || (isOver ? '#EFF6FF' : '#F9FAFB'),
        border: isSelected
          ? '2px solid #3B82F6'
          : (isOver
            ? '2px dashed #3B82F6'
            : (column.props.borderWidth && column.props.borderWidth !== '0px'
              ? `${column.props.borderWidth} solid ${column.props.borderColor || '#E5E7EB'}`
              : '2px dashed #E5E7EB')),
        borderRadius: '4px',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        boxSizing: 'border-box',
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {/* Column Actions (Drag, Duplicate, Delete) */}
      {isSelected && (
        <div className="absolute top-0 right-0 flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded-bl text-xs z-10">
          <button
            {...listeners}
            className="cursor-move hover:bg-blue-600 px-1 rounded"
            title="Drag to reorder column"
          >
            ⋮⋮
          </button>
          <button
            onClick={handleDuplicate}
            className="hover:bg-blue-600 px-1 rounded"
            title="Duplicate column"
          >
            ⎘
          </button>
          <button
            onClick={handleDelete}
            className="hover:bg-red-600 px-1 rounded"
            title="Delete column"
          >
            ×
          </button>
        </div>
      )}

      {column.children && column.children.length > 0 ? (
        <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
          {column.children.map((nestedChild) => (
            <ComponentRenderer
              key={nestedChild.id}
              component={nestedChild}
              isSelected={selectedComponentId === nestedChild.id}
              onSelect={() => onSelectComponent(nestedChild.id)}
              parentId={column.id}
            />
          ))}
        </SortableContext>
      ) : (
        <div className="flex flex-col items-center justify-center h-full min-h-[80px] text-gray-400">
          <svg
            className="w-8 h-8 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <p className="text-xs font-medium">Drop content here</p>
        </div>
      )}
    </div>
  );
}

// Droppable Container Component (for Section and Container types)
function DroppableContainer({ component, style, selectedComponentId, onSelectComponent }) {
  const { setNodeRef, isOver } = useDroppable({
    id: component.id,
    data: {
      type: 'container',
      containerId: component.id,
    },
  });

  const childIds = component.children ? component.children.map((c) => c.id) : [];

  const containerStyle = {
    ...style,
    minHeight: component.children && component.children.length > 0 ? 'auto' : '120px',
    border: isOver
      ? '2px dashed #3B82F6'
      : (component.props.borderWidth && component.props.borderWidth !== '0px'
        ? `${component.props.borderWidth} solid ${component.props.borderColor || '#E5E7EB'}`
        : '2px dashed #E5E7EB'),
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  };

  return (
    <div ref={setNodeRef} style={containerStyle}>
      {component.children && component.children.length > 0 ? (
        <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
          {component.children.map((child) => (
            <ComponentRenderer
              key={child.id}
              component={child}
              isSelected={selectedComponentId === child.id}
              onSelect={() => onSelectComponent(child.id)}
              parentId={component.id}
            />
          ))}
        </SortableContext>
      ) : (
        <div className="flex flex-col items-center justify-center h-full min-h-[80px] text-gray-400">
          <svg
            className="w-8 h-8 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <p className="text-xs font-medium">Drop content here</p>
        </div>
      )}
    </div>
  );
}

export default function ComponentRenderer({ component, isSelected, onSelect, parentId }) {
  const dispatch = useDispatch();
  const selectedComponentId = useSelector((state) => state.emailBuilder.selectedComponentId);
  const [showContextMenu, setShowContextMenu] = useState(false);

  const handleSelectComponent = (id) => {
    dispatch(selectComponent(id));
  };

  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver, over, active } =
    useSortable({
      id: component.id,
      data: {
        type: component.type,
        parentId: parentId,
      },
    });

  // Determine if this component is being hovered over during drag
  const isOverCurrent = over?.id === component.id && active?.id !== component.id;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(removeComponent(component.id));
  };

  const handleDuplicate = (e) => {
    e.stopPropagation();
    dispatch(duplicateComponent(component.id));
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowContextMenu(true);
  };

  const renderComponent = () => {
    const { type, props } = component;

    switch (type) {
      case COMPONENT_TYPES.TEXT:
        return (
          <div
            style={{
              fontSize: props.fontSize + 'px',
              color: props.color,
              fontFamily: props.fontFamily,
              textAlign: props.textAlign,
              padding: props.padding,
              border: props.borderWidth && props.borderWidth !== '0px' ? `${props.borderWidth} solid ${props.borderColor || '#E5E7EB'}` : 'none',
            }}
            dangerouslySetInnerHTML={{ __html: props.content }}
          />
        );

      case COMPONENT_TYPES.HEADING:
        const HeadingTag = props.level || 'h2';
        return (
          <HeadingTag
            style={{
              fontSize: props.fontSize + 'px',
              color: props.color,
              fontFamily: props.fontFamily,
              textAlign: props.textAlign,
              padding: props.padding,
              margin: 0,
              border: props.borderWidth && props.borderWidth !== '0px' ? `${props.borderWidth} solid ${props.borderColor || '#E5E7EB'}` : 'none',
            }}
          >
            {props.content}
          </HeadingTag>
        );

      case COMPONENT_TYPES.BUTTON:
        return (
          <div style={{ textAlign: props.textAlign || 'center', padding: '10px' }}>
            <a
              href={props.href}
              style={{
                display: 'inline-block',
                backgroundColor: props.backgroundColor,
                color: props.color,
                padding: props.padding,
                borderRadius: props.borderRadius,
                textDecoration: 'none',
                fontFamily: 'Arial, sans-serif',
                border: props.borderWidth && props.borderWidth !== '0px' ? `${props.borderWidth} solid ${props.borderColor || '#E5E7EB'}` : 'none',
              }}
            >
              {props.text}
            </a>
          </div>
        );

      case COMPONENT_TYPES.IMAGE:
        return (
          <div style={{ textAlign: 'center' }}>
            <img
              src={props.src}
              alt={props.alt}
              style={{
                width: props.width,
                height: props.height,
                maxWidth: '100%',
                border: props.borderWidth && props.borderWidth !== '0px' ? `${props.borderWidth} solid ${props.borderColor || '#E5E7EB'}` : 'none',
              }}
            />
          </div>
        );

      case COMPONENT_TYPES.DIVIDER:
        return (
          <hr
            style={{
              borderColor: props.borderColor,
              borderWidth: props.borderWidth,
              borderStyle: 'solid',
              margin: props.margin,
            }}
          />
        );

      case COMPONENT_TYPES.SPACER:
        return <div style={{ height: props.height }} />;

      case COMPONENT_TYPES.ROW:
        const columnIds = component.children ? component.children.map(c => c.id) : [];
        const isRowSelected = selectedComponentId === component.id;

        return (
          <div className="relative group" style={{ margin: '8px 0' }}>
            {/* Extended Selection Overlay - Large clickable area */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className={`absolute cursor-pointer transition-all ${
                isRowSelected
                  ? 'ring-2 ring-blue-500 bg-blue-50 bg-opacity-10'
                  : 'hover:ring-2 hover:ring-blue-300 hover:bg-blue-50 hover:bg-opacity-5'
              }`}
              style={{
                top: '-8px',
                left: '-60px',
                right: '-60px',
                bottom: '-8px',
                zIndex: 0,
              }}
              title="Click to select row"
            />

            {/* Row Action Buttons - Aligned with extended area */}
            {isRowSelected && (
              <div
                className="absolute flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded-bl text-xs z-50"
                style={{
                  top: '-8px',
                  right: '-60px',
                }}
              >
                <button
                  {...listeners}
                  className="cursor-move hover:bg-blue-600 px-1 rounded"
                  title="Drag to reorder row"
                  onClick={(e) => e.stopPropagation()}
                >
                  ⋮⋮
                </button>
                <button
                  onClick={handleDuplicate}
                  className="hover:bg-blue-600 px-1 rounded"
                  title="Duplicate row"
                >
                  ⎘
                </button>
                <button
                  onClick={handleDelete}
                  className="hover:bg-red-600 px-1 rounded"
                  title="Delete row"
                >
                  ×
                </button>
              </div>
            )}

            {/* Row Content */}
            <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
              <div style={{
                display: 'flex',
                padding: props.padding || '10px',
                backgroundColor: props.backgroundColor || 'transparent',
                boxSizing: 'border-box',
                position: 'relative',
                zIndex: 1,
                border: props.borderWidth && props.borderWidth !== '0px' ? `${props.borderWidth} solid ${props.borderColor || '#E5E7EB'}` : 'none',
              }}>

                {component.children &&
                  component.children.map((child, index) => (
                    <div key={child.id} style={{
                      width: child.props.width,
                      marginRight: index < component.children.length - 1 ? '10px' : '0',
                      boxSizing: 'border-box',
                    }}>
                      <SortableColumnWrapper
                        column={child}
                        parentId={component.id}
                        selectedComponentId={selectedComponentId}
                        onSelectComponent={handleSelectComponent}
                      />
                    </div>
                  ))}
              </div>
            </SortableContext>
          </div>
        );

      case COMPONENT_TYPES.SECTION:
        return (
          <DroppableContainer
            component={component}
            style={{
              backgroundColor: props.backgroundColor,
              padding: props.padding,
            }}
            selectedComponentId={selectedComponentId}
            onSelectComponent={handleSelectComponent}
          />
        );

      case COMPONENT_TYPES.CONTAINER:
        return (
          <DroppableContainer
            component={component}
            style={{
              maxWidth: props.maxWidth,
              margin: '0 auto',
              padding: props.padding,
            }}
            selectedComponentId={selectedComponentId}
            onSelectComponent={handleSelectComponent}
          />
        );

      default:
        return <div className="text-gray-400">Unknown component: {type}</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onContextMenu={handleContextMenu}
      className={`relative group ${
        isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-blue-300'
      }`}
    >
      {/* Drop Indicator - Shows where component will be inserted */}
      {isOverCurrent && (
        <div className="absolute -top-1 left-0 right-0 h-1 bg-blue-500 rounded-full z-50 shadow-lg">
          <div className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-blue-500 rounded-full shadow-lg"></div>
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-500 rounded-full shadow-lg"></div>
        </div>
      )}

      {renderComponent()}

      {/* Drag Handle & Actions - Only for non-ROW components */}
      {isSelected && component.type !== COMPONENT_TYPES.ROW && (
        <div className="absolute top-0 right-0 flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded-bl text-xs z-50">
          <button
            {...listeners}
            className="cursor-move hover:bg-blue-600 px-1 rounded"
            title="Drag to reorder"
          >
            ⋮⋮
          </button>
          <button
            onClick={handleDuplicate}
            className="hover:bg-blue-600 px-1 rounded"
            title="Duplicate"
          >
            ⎘
          </button>
          <button
            onClick={handleDelete}
            className="hover:bg-red-600 px-1 rounded"
            title="Delete"
          >
            ×
          </button>
        </div>
      )}

      {/* Context Menu */}
      {showContextMenu && (
        <>
          <div
            className="fixed inset-0"
            onClick={() => setShowContextMenu(false)}
          />
          <div className="absolute top-0 right-0 bg-white border border-gray-200 shadow-lg rounded z-50 py-1 min-w-[150px]">
            <button
              onClick={handleDuplicate}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Duplicate
            </button>
            <button
              onClick={handleDelete}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
