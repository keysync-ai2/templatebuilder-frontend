'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setRightPanel } from '@/store/slices/uiSlice';
import dynamic from 'next/dynamic';

// Dynamically import EmailTemplateBuilder to avoid SSR issues
const EmailTemplateBuilder = dynamic(
  () => import('../email-builder/EmailTemplateBuilder'),
  { ssr: false }
);

export default function TemplateBuilderWidget({ data, onExpand }) {
  const dispatch = useDispatch();
  const { title, description, timestamp } = data;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    if (isFullScreen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isFullScreen]);

  const handleExpand = () => {
    console.log('Template Builder - handleExpand called');
    console.log('onExpand:', onExpand);
    console.log('Current isExpanded:', isExpanded);

    // Open directly in expanded view (not right panel)
    setIsExpanded(true);
    console.log('After setIsExpanded(true)');
  };

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-gray-950 rounded-lg shadow-2xl w-full max-w-[95vw] h-[95vh] flex flex-col">
          <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800 rounded-t-lg">
            <h3 className="text-lg font-semibold text-gray-100">{title || 'Email Template Builder'}</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-200 p-2 hover:bg-gray-800 rounded transition-colors"
              title="Close builder"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <EmailTemplateBuilder />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="template-builder-widget bg-gray-800 rounded-lg p-4 mb-3 cursor-pointer hover:bg-gray-700 transition-colors border-2 border-transparent hover:border-blue-500"
      onClick={(e) => {
        console.log('Clicked on template builder card!', e);
        handleExpand();
      }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-100 mb-1">
            {title || 'Email Template Builder'}
          </h3>
          {description && (
            <p className="text-sm text-gray-400 mb-3">{description}</p>
          )}
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Button clicked!');
                handleExpand();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
            >
              Open Template Builder
            </button>
            <span className="text-sm text-gray-500">or click anywhere on this card</span>
          </div>
        </div>
      </div>
      {timestamp && (
        <span className="text-xs text-gray-500 mt-3 block">
          {new Date(timestamp).toLocaleString()}
        </span>
      )}
    </div>
  );
}
