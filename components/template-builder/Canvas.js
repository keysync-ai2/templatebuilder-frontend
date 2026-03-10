'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { addRow, deleteRow, addColumn, deleteColumn, setSelectedElement, updateColumn } from '@/store/slices/templateBuilderSlice';

function SortableRow({ row, index }) {
  const dispatch = useDispatch();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.RowID,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const selectedElement = useSelector((state) => state.templateBuilder.selectedElement);
  const isSelected = selectedElement?.type === 'row' && selectedElement?.id === row.RowID;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-4 border-2 rounded-lg ${
        isSelected ? 'border-blue-500' : 'border-gray-700'
      } bg-gray-800 hover:border-gray-600 transition-colors`}
    >
      {/* Row Header */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between p-2 bg-gray-750 border-b border-gray-700 cursor-move"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
          <span className="text-sm text-gray-300">{row.Name || `Row ${index + 1}`}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(setSelectedElement({ type: 'row', id: row.RowID }))}
            className="text-gray-400 hover:text-blue-500 p-1"
            title="Select row"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => dispatch(deleteRow(row.RowID))}
            className="text-gray-400 hover:text-red-500 p-1"
            title="Delete row"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Row Content - Columns */}
      <div className="p-4">
        {row.Columns && row.Columns.length > 0 ? (
          <div className={`grid gap-4 ${row.Columns.length === 2 ? 'grid-cols-2' : row.Columns.length === 3 ? 'grid-cols-3' : row.Columns.length === 4 ? 'grid-cols-4' : 'grid-cols-1'}`}>
            {row.Columns.map((column) => (
              <ColumnComponent key={column.ColumnID} column={column} rowId={row.RowID} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-700 rounded">
            Drop components here or click + to add
          </div>
        )}
      </div>
    </div>
  );
}

function ColumnComponent({ column, rowId }) {
  const dispatch = useDispatch();
  const selectedElement = useSelector((state) => state.templateBuilder.selectedElement);
  const isSelected = selectedElement?.type === 'column' && selectedElement?.id === column.ColumnID;

  const renderContent = () => {
    switch (column.Type) {
      case 'Text':
        return (
          <div
            style={{
              fontFamily: column.Style?.fontFamily,
              fontSize: column.Style?.fontSize + 'px',
              color: column.Style?.color,
              textAlign: column.Style?.textAlign,
            }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              dispatch(updateColumn({
                rowId,
                columnId: column.ColumnID,
                updates: { Text: e.target.innerText }
              }));
            }}
            className="outline-none"
          >
            {column.Text || 'Enter text...'}
          </div>
        );
      case 'Image':
        return (
          <img
            src={column.Image || 'https://via.placeholder.com/150'}
            alt={column.Name}
            className="w-full h-auto rounded"
          />
        );
      case 'Button':
        return (
          <a
            href={column.URL || '#'}
            style={{
              backgroundColor: column.Style?.backgroundColor,
              color: column.Style?.color,
              fontFamily: column.Style?.fontFamily,
              fontSize: column.Style?.fontSize + 'px',
              textAlign: column.Style?.textAlign,
              padding: '10px 20px',
            }}
            className="inline-block rounded no-underline"
          >
            {column.Text || 'Button'}
          </a>
        );
      default:
        return <div className="text-gray-500">Unknown type: {column.Type}</div>;
    }
  };

  return (
    <div
      onClick={() => dispatch(setSelectedElement({ type: 'column', id: column.ColumnID, rowId }))}
      className={`border-2 rounded p-3 cursor-pointer ${
        isSelected ? 'border-blue-500 bg-blue-900/10' : 'border-gray-700 hover:border-gray-600'
      } relative group`}
      style={{
        backgroundColor: column.Style?.backgroundColor,
        padding: column.Style?.padding ?
          `${column.Style.padding.top}px ${column.Style.padding.right}px ${column.Style.padding.bottom}px ${column.Style.padding.left}px` :
          '12px',
      }}
    >
      {renderContent()}
      <button
        onClick={(e) => {
          e.stopPropagation();
          dispatch(deleteColumn({ rowId, columnId: column.ColumnID }));
        }}
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-opacity"
        title="Delete column"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function Canvas({ onDrop }) {
  const dispatch = useDispatch();
  const template = useSelector((state) => state.templateBuilder.template);
  const rows = template.data.body || [];

  const { setNodeRef } = useDroppable({
    id: 'canvas',
  });

  return (
    <div className="flex-1 bg-gray-950 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-100">Email Template</h2>
          <button
            onClick={() => dispatch(addRow({ name: 'New Row' }))}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Row
          </button>
        </div>

        <div
          ref={setNodeRef}
          className="bg-white rounded-lg shadow-lg p-6 min-h-[600px]"
          style={{ maxWidth: '600px', margin: '0 auto' }}
        >
          {rows.length === 0 ? (
            <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Drop components here to start building</p>
                <p className="text-sm text-gray-400">Or click "Add Row" button above</p>
              </div>
            </div>
          ) : (
            <SortableContext items={rows.map(r => r.RowID)} strategy={verticalListSortingStrategy}>
              {rows.map((row, index) => (
                <SortableRow key={row.RowID} row={row} index={index} />
              ))}
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  );
}
