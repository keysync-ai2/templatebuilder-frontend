'use client';

import { useSelector, useDispatch } from 'react-redux';
import { closeRightPanel } from '@/store/slices/uiSlice';
import WidgetRenderer from '../widgets/WidgetRenderer';

export default function RightPanel() {
  const dispatch = useDispatch();
  const { rightPanelOpen, rightPanelContent } = useSelector((state) => state.ui);

  if (!rightPanelOpen || !rightPanelContent) return null;

  return (
    <aside className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-gray-100">Full Screen View</h2>
        <button
          onClick={() => dispatch(closeRightPanel())}
          className="text-gray-400 hover:text-gray-200 p-1 rounded hover:bg-gray-800 transition-colors"
          aria-label="Close panel"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <WidgetRenderer widget={rightPanelContent} />
      </div>
    </aside>
  );
}
