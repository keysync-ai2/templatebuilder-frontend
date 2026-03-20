'use client';

import { useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { generateEmailHTML } from './htmlGenerator';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import * as api from '@/lib/api';

export default function BottomPanel() {
  const { components, templateName, templateSubject } = useSelector(
    (state) => state.emailBuilder
  );
  const [activeTab, setActiveTab] = useState('code');
  const [htmlCode, setHtmlCode] = useState('');
  const [backendHtml, setBackendHtml] = useState('');
  const [renderMeta, setRenderMeta] = useState(null);
  const [rendering, setRendering] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');

  // Local HTML (basic — no MSO)
  useEffect(() => {
    const html = generateEmailHTML(components, { templateName, templateSubject });
    setHtmlCode(html);
  }, [components, templateName, templateSubject]);

  // Render via backend engine
  const handleRender = useCallback(async () => {
    setRendering(true);
    try {
      const template = { templateName, templateSubject, components };
      const data = await api.renderTemplate(template);
      setBackendHtml(data.html);
      setRenderMeta({ size: data.size_bytes, components: components.length });
      setActiveTab('production');
    } catch (err) {
      console.error('Render failed:', err);
    } finally {
      setRendering(false);
    }
  }, [components, templateName, templateSubject]);

  const handleCopy = (html) => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (html, suffix = '') => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName.replace(/\s+/g, '-').toLowerCase()}${suffix}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentHtml = activeTab === 'production' && backendHtml ? backendHtml : htmlCode;
  const deviceWidths = { desktop: '600px', tablet: '480px', mobile: '375px' };

  return (
    <>
      <div className="h-full flex flex-col bg-gray-900">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-t border-gray-700 shrink-0">
          <div className="flex items-center gap-1">
            {/* Tabs */}
            <button
              onClick={() => setActiveTab('code')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                activeTab === 'code' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Basic HTML
            </button>
            <button
              onClick={() => { setActiveTab('production'); if (!backendHtml) handleRender(); }}
              className={`px-2.5 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                activeTab === 'production' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Production HTML
              {rendering && <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />}
            </button>

            {renderMeta && activeTab === 'production' && (
              <div className="flex items-center gap-2 ml-3 text-[10px] text-gray-500">
                <span>{(renderMeta.size / 1024).toFixed(1)} KB</span>
                <span className="text-green-400 flex items-center gap-0.5">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  MSO
                </span>
                <span className="text-green-400 flex items-center gap-0.5">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Responsive
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Preview */}
            <button
              onClick={() => { if (!backendHtml) handleRender(); setShowPreview(true); }}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs rounded transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </button>

            {/* Copy */}
            <button
              onClick={() => handleCopy(currentHtml)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs rounded transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Copied!</>
              ) : (
                <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copy</>
              )}
            </button>

            {/* Download */}
            <button
              onClick={() => handleDownload(currentHtml, activeTab === 'production' ? '-production' : '')}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 overflow-auto">
          <SyntaxHighlighter
            language="html"
            style={vscDarkPlus}
            showLineNumbers={true}
            customStyle={{
              margin: 0, padding: '16px', fontSize: '12px', lineHeight: '1.5',
              height: '100%', background: '#1e1e1e',
            }}
            codeTagProps={{ style: { fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace' } }}
          >
            {currentHtml}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-[#0a0f1a] rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700/50 shrink-0">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-200">Email Preview</span>
                {/* Device toggle */}
                <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-0.5">
                  {Object.entries({ desktop: 'Desktop', tablet: 'Tablet', mobile: 'Mobile' }).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setPreviewDevice(key)}
                      className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-colors ${
                        previewDevice === key ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {renderMeta && (
                  <span className="text-[10px] text-gray-500">{(renderMeta.size / 1024).toFixed(1)} KB</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(backendHtml || htmlCode)}
                  className="px-2.5 py-1 text-[10px] text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Copy HTML
                </button>
                <button
                  onClick={() => handleDownload(backendHtml || htmlCode, '-production')}
                  className="px-2.5 py-1 text-[10px] text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  Download
                </button>
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
            <div className="flex-1 overflow-auto bg-gray-200 flex justify-center p-6">
              {rendering ? (
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div style={{ width: deviceWidths[previewDevice], transition: 'width 0.3s ease' }}>
                  <iframe
                    srcDoc={backendHtml || htmlCode}
                    className="w-full bg-white shadow-xl rounded-lg"
                    style={{ minHeight: '600px', border: 'none' }}
                    title="Email preview"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
