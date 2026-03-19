'use client';

import { useDispatch, useSelector } from 'react-redux';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import LeftPanel from './LeftPanel';
import MiddlePanel from './MiddlePanel';
import RightPanel from './RightPanel';
import BottomPanel from './BottomPanel';
import { addComponent, moveComponent, replaceComponent } from '@/store/slices/emailBuilderSlice';
import { v4 as uuidv4 } from 'uuid';
import { COMPONENT_TYPES } from './componentLibrary';

export default function EmailTemplateBuilder() {
  const dispatch = useDispatch();
  const components = useSelector((state) => state.emailBuilder.components);
  console.log('[Builder] components from Redux:', components?.length, 'roots, first type:', components?.[0]?.type, 'first children:', components?.[0]?.children?.length);
  const [activeId, setActiveId] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  const [showBottomPanel, setShowBottomPanel] = useState(true);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(250);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);

    // If dragging from library
    if (active.data.current?.component) {
      setActiveComponent(active.data.current.component);
    } else {
      // If dragging existing component, find it in the tree
      const findComponent = (comps, id) => {
        for (const comp of comps) {
          if (comp.id === id) return comp;
          if (comp.children) {
            const found = findComponent(comp.children, id);
            if (found) return found;
          }
        }
        return null;
      };

      const draggedComponent = findComponent(components, active.id);
      if (draggedComponent) {
        setActiveComponent({
          name: draggedComponent.type === 'row' ? 'Row Layout' : draggedComponent.type.charAt(0).toUpperCase() + draggedComponent.type.slice(1),
          icon: draggedComponent.type === 'row' ? '▯' : draggedComponent.type === 'column' ? '▯' : '📄',
          type: draggedComponent.type,
          ...draggedComponent
        });
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveComponent(null);
      return;
    }

    // Handle dropping new component from library
    if (active.data.current?.isNew) {
      const componentDef = active.data.current.component;

      const newComponent = {
        type: componentDef.type,
        props: { ...componentDef.defaultProps },
        styles: {},
      };

      // If it's a column layout, add the children structure
      if (componentDef.children) {
        newComponent.children = componentDef.children.map((child) => ({
          id: uuidv4(),
          type: child.type,
          props: { ...child.defaultProps },
          children: [],
          parentId: null,
        }));
      }

      // Check if dropping a ROW component onto a column - Replace the parent ROW instead
      if (newComponent.type === COMPONENT_TYPES.ROW && over.data.current?.type === 'column') {
        // Find the parent row of the column
        const findParentRow = (comps, columnId) => {
          for (const comp of comps) {
            if (comp.type === COMPONENT_TYPES.ROW && comp.children) {
              if (comp.children.some(c => c.id === columnId)) {
                return comp.id;
              }
            }
            if (comp.children) {
              const found = findParentRow(comp.children, columnId);
              if (found) return found;
            }
          }
          return null;
        };

        const parentRowId = findParentRow(components, over.data.current.columnId);
        if (parentRowId) {
          // Replace the entire row
          dispatch(
            replaceComponent({
              componentId: parentRowId,
              newComponent: {
                id: uuidv4(),
                ...newComponent,
                parentId: null,
                visibility: true,
                locked: false,
              },
            })
          );
          setActiveId(null);
          setActiveComponent(null);
          return;
        }
      }

      // Determine where to drop the component
      let targetParentId = null;
      let targetPosition = undefined;

      // Check if dropping into a column
      if (over.data.current?.type === 'column') {
        targetParentId = over.data.current.columnId;
      }
      // Check if dropping into a container (section/container)
      else if (over.data.current?.type === 'container') {
        targetParentId = over.data.current.containerId;
      }
      // Dropping at the top level (canvas) - calculate position
      else {
        const overParentId = over.data.current?.parentId;

        // Helper to find position in components array
        const findComponentPosition = (comps, id) => {
          for (let i = 0; i < comps.length; i++) {
            if (comps[i].id === id) return i;
          }
          return -1;
        };

        // If dropping over a top-level component
        if (!overParentId) {
          const position = findComponentPosition(components, over.id);
          if (position !== -1) {
            targetPosition = position;
          }
        }
      }

      dispatch(
        addComponent({
          component: newComponent,
          parentId: targetParentId,
          position: targetPosition,
        })
      );
    } else {
      // Handle reordering existing components
      if (active.id !== over.id) {
        const activeParentId = active.data.current?.parentId;

        // Helper to find component by ID recursively
        const findComponentById = (comps, id) => {
          for (const comp of comps) {
            if (comp.id === id) return comp;
            if (comp.children) {
              const found = findComponentById(comp.children, id);
              if (found) return found;
            }
          }
          return null;
        };

        // Check if dropping INTO a column (not swapping with column)
        if (over.data.current?.type === 'column' && active.data.current?.type !== 'column') {
          // Dropping a basic component INTO a column
          dispatch(
            moveComponent({
              componentId: active.id,
              newPosition: undefined, // Append to end of column
              newParentId: over.data.current.columnId,
            })
          );
        } else {
          // Reordering within same parent or between same-level components
          const overParentId = over.data.current?.parentId;

          // Only reorder if moving within same parent level
          if (activeParentId === overParentId) {
            // Helper function to find component index within parent
            const findComponentInParent = (parentId, childId) => {
              if (!parentId) {
                // Top level
                return components.findIndex((c) => c.id === childId);
              }
              // Find parent and get child index
              const parent = findComponentById(components, parentId);
              if (parent && parent.children) {
                return parent.children.findIndex((c) => c.id === childId);
              }
              return -1;
            };

            const oldIndex = findComponentInParent(activeParentId, active.id);
            const newIndex = findComponentInParent(overParentId, over.id);

            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
              dispatch(
                moveComponent({
                  componentId: active.id,
                  newPosition: newIndex,
                  newParentId: activeParentId,
                })
              );
            }
          }
        }
      }
    }

    setActiveId(null);
    setActiveComponent(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveComponent(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex flex-col h-full bg-white">
        {/* Top Section - Main Editor */}
        <div className="flex flex-1 overflow-hidden" style={{ height: showBottomPanel ? `calc(100% - ${bottomPanelHeight}px)` : '100%' }}>
          {/* Left Panel - 20% */}
          <div className="w-1/5 h-full">
            <LeftPanel />
          </div>

          {/* Middle Panel - 60% */}
          <div className="w-3/5 h-full">
            <MiddlePanel />
          </div>

          {/* Right Panel - 20% */}
          <div className="w-1/5 h-full">
            <RightPanel />
          </div>
        </div>

        {/* Bottom Section - HTML Viewer */}
        {showBottomPanel && (
          <div
            className="border-t border-gray-300"
            style={{ height: `${bottomPanelHeight}px` }}
          >
            <BottomPanel />
          </div>
        )}

        {/* Toggle Bottom Panel Button */}
        <button
          onClick={() => setShowBottomPanel(!showBottomPanel)}
          className="absolute bottom-0 right-4 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-t text-xs shadow-lg transition-colors"
          style={{
            bottom: showBottomPanel ? `${bottomPanelHeight}px` : 0,
            zIndex: 10
          }}
        >
          {showBottomPanel ? 'Hide' : 'Show'} HTML
        </button>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeComponent ? (
          <div className="bg-white border-2 border-blue-500 rounded-lg shadow-xl opacity-95">
            {activeComponent.type === 'row' && activeComponent.children ? (
              // Show visual preview for row layouts with columns
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{activeComponent.icon}</span>
                  <span className="text-sm font-medium">{activeComponent.name}</span>
                  <span className="text-xs text-gray-500">({activeComponent.children.length} columns)</span>
                </div>
                <div className="flex gap-2">
                  {activeComponent.children.map((col, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 border border-blue-200 rounded p-2 flex-1 min-w-[40px] h-16 flex items-center justify-center"
                    >
                      <span className="text-xs text-blue-600 font-medium">
                        {col.props?.width || `${Math.floor(100 / activeComponent.children.length)}%`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Show simple preview for other components
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeComponent.icon}</span>
                  <span className="text-sm font-medium">{activeComponent.name}</span>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
