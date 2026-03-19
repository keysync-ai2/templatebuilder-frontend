'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const EmailTemplateBuilder = dynamic(
  () => import('../email-builder/EmailTemplateBuilder'),
  { ssr: false }
);

export default function TemplateBuilderWidget({ data, onExpand }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { title, description, timestamp, editor_link, template_id, html } = data;
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExpanded]);

  const handleOpenEditor = () => {
    if (editor_link) {
      // Extract template ID from editor link and navigate
      const id = template_id || editor_link.split('/editor/')[1];
      if (id) {
        router.push(`/editor/${id}`);
        return;
      }
    }
    // Fallback: open inline builder
    setIsExpanded(true);
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
    <div className="template-builder-widget bg-gray-800 rounded-lg p-4 mb-3 border border-gray-700">
      {/* HTML Preview */}
      {html && (
        <div className="mb-3 rounded-lg overflow-hidden border border-gray-700 bg-white">
          <iframe
            srcDoc={html}
            className="w-full pointer-events-none"
            style={{ height: '300px' }}
            title="Email preview"
          />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-100 mb-1">
            {title || 'Email Template'}
          </h3>
          {description && (
            <p className="text-sm text-gray-400 mb-3">{description}</p>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenEditor}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {editor_link ? 'Customize in Editor' : 'Open Template Builder'}
            </button>
            {!editor_link && (
              <span className="text-xs text-gray-500">Opens inline builder</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
