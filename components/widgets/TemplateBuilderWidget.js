'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loadTemplate } from '@/store/slices/emailBuilderSlice';

export default function TemplateBuilderWidget({ data }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { title, description, editor_link, template_id, html, template } = data;
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showPreview) setShowPreview(false);
    };
    if (showPreview) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showPreview]);

  const handleOpenEditor = async () => {
    // Option 1: has editor_link/template_id — navigate directly
    if (editor_link || template_id) {
      const id = template_id || editor_link.split('/editor/')[1];
      if (id) {
        router.push(`/editor/${id}`);
        return;
      }
    }

    // Option 2: has template component tree — save to API then open
    if (template && template.components) {
      try {
        const { createTemplate } = await import('@/lib/api');
        const result = await createTemplate(
          template.templateName || title || 'Chat Template',
          template.components,
          template.templateSubject || '',
        );
        // Load into Redux so editor shows it immediately
        dispatch(loadTemplate({
          templateName: template.templateName || title,
          templateSubject: template.templateSubject || '',
          components: template.components,
        }));
        router.push(`/editor/${result.id}`);
      } catch (err) {
        console.error('Failed to save template:', err);
      }
      return;
    }

    // Option 3: nothing to work with — open blank editor
    try {
      const { createTemplate } = await import('@/lib/api');
      const result = await createTemplate(title || 'Chat Template', []);
      router.push(`/editor/${result.id}`);
    } catch (err) {
      console.error('Failed to create template:', err);
    }
  };

  const hasEditor = editor_link || template_id || template || html;

  return (
    <>
      <div className="glass rounded-2xl rounded-tl-md overflow-hidden">
        {/* Card content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-9 h-9 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/10 rounded-xl flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-200">{title || 'Email Template'}</h3>
              {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-4">
            {html && (
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 glass rounded-xl text-xs font-medium text-gray-300 hover:text-white hover:border-gray-600 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Preview
              </button>
            )}
            {hasEditor && (
              <button
                onClick={handleOpenEditor}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-medium transition-all btn-shine shadow-md shadow-cyan-500/10"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Customize in Editor
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && html && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
        >
          <div className="bg-[#0a0f1a] rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-700/50">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-200">{title || 'Email Preview'}</span>
              </div>
              <div className="flex items-center gap-2">
                {editor_link && (
                  <button
                    onClick={handleOpenEditor}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-medium transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                    </svg>
                    Edit
                  </button>
                )}
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Email render */}
            <div className="flex-1 overflow-auto bg-gray-100 rounded-b-2xl">
              <iframe
                srcDoc={html}
                className="w-full h-full min-h-[600px]"
                title="Email preview"
                style={{ border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
