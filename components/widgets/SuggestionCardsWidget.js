'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { loadTemplate } from '@/store/slices/emailBuilderSlice';
import * as api from '@/lib/api';

export default function SuggestionCardsWidget({ data }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { suggestions = [], query } = data;
  const [saving, setSaving] = useState(null);
  const [previewSlug, setPreviewSlug] = useState(null);

  const handleUse = async (suggestion) => {
    setSaving(suggestion.slug);
    try {
      const result = await api.createTemplate(
        suggestion.name,
        suggestion.components,
        '',
      );
      dispatch(loadTemplate({
        templateName: suggestion.name,
        templateSubject: '',
        components: suggestion.components,
      }));
      router.push(`/editor/${result.id}?from=chat`);
    } catch (err) {
      console.error('Failed to use template:', err);
    } finally {
      setSaving(null);
    }
  };

  if (!suggestions.length) {
    return (
      <div className="glass rounded-2xl rounded-tl-md p-4">
        <p className="text-sm text-gray-400">No suggestions found. Try describing your email differently.</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass rounded-2xl rounded-tl-md overflow-hidden">
        <div className="p-4 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <span className="text-sm font-semibold text-gray-200">Template Suggestions</span>
          </div>
          <p className="text-[11px] text-gray-500">{suggestions.length} templates customized for your request</p>
        </div>

        {/* Horizontal scrollable cards */}
        <div className="flex gap-3 px-4 pb-4 overflow-x-auto" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {suggestions.map((s, idx) => (
            <div
              key={s.slug}
              className="shrink-0 w-[70vw] sm:w-64 bg-gray-900/50 border border-gray-700/50 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Score + badges */}
              <div className="px-3 pt-3 flex items-center justify-between">
                <div className="flex gap-1">
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-semibold uppercase">{s.industry}</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold uppercase">{s.purpose}</span>
                </div>
                <span className="text-[9px] text-gray-500 font-mono">{Math.round(s.score * 100)}%</span>
              </div>

              {/* Info */}
              <div className="px-3 pt-2 pb-1">
                <h4 className="text-xs font-semibold text-gray-200 truncate">{s.name}</h4>
                <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">{s.description}</p>
                <p className="text-[10px] text-gray-600 mt-1">{s.components?.length || 0} sections</p>
              </div>

              {/* Actions */}
              <div className="px-3 pb-3 flex gap-2">
                <button
                  onClick={() => setPreviewSlug(previewSlug === s.slug ? null : s.slug)}
                  className="flex-1 py-1.5 text-[10px] font-medium text-gray-400 glass rounded-lg hover:text-white hover:border-gray-600 transition-all"
                >
                  Preview
                </button>
                <button
                  onClick={() => handleUse(s)}
                  disabled={saving === s.slug}
                  className="flex-1 py-1.5 text-[10px] font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 transition-all"
                >
                  {saving === s.slug ? '...' : 'Use This'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview modal */}
      {previewSlug && (() => {
        const s = suggestions.find(s => s.slug === previewSlug);
        if (!s) return null;

        // Quick render — build a basic preview from components
        const previewHtml = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">${s.components?.map(comp => {
          const bg = comp.props?.backgroundColor || '#FFFFFF';
          return `<div style="background:${bg};padding:${comp.props?.padding || '0'};">
            ${(comp.children || []).map(col => `<div style="padding:${col.props?.padding || '10px'};">
              ${(col.children || []).map(child => {
                if (child.type === 'heading') return `<${child.props?.level || 'h2'} style="color:${child.props?.color || '#000'};font-size:${child.props?.fontSize || 24}px;text-align:${child.props?.textAlign || 'left'};padding:${child.props?.padding || '10px'};margin:0;">${child.props?.content || ''}</${child.props?.level || 'h2'}>`;
                if (child.type === 'text') return `<p style="color:${child.props?.color || '#666'};font-size:${child.props?.fontSize || 14}px;text-align:${child.props?.textAlign || 'left'};padding:${child.props?.padding || '5px'};margin:0;">${child.props?.content || ''}</p>`;
                if (child.type === 'button') return `<div style="text-align:${child.props?.textAlign || 'center'};padding:10px;"><a style="background:${child.props?.backgroundColor || '#2563EB'};color:${child.props?.color || '#fff'};padding:${child.props?.padding || '12px 24px'};border-radius:${child.props?.borderRadius || '4px'};text-decoration:none;display:inline-block;">${child.props?.text || 'Click'}</a></div>`;
                if (child.type === 'image') return `<img src="${child.props?.src || ''}" alt="${child.props?.alt || ''}" style="width:100%;max-width:100%;display:block;" />`;
                if (child.type === 'spacer') return `<div style="height:${child.props?.height || '20px'};"></div>`;
                if (child.type === 'divider') return `<hr style="border:0;border-top:1px solid ${child.props?.borderColor || '#E5E7EB'};margin:${child.props?.margin || '20px 0'};" />`;
                return '';
              }).join('')}
            </div>`).join('')}
          </div>`;
        }).join('') || ''}</div>`;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} onClick={() => setPreviewSlug(null)}>
            <div className="bg-[#0a0f1a] rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-[95vw] sm:max-w-3xl max-h-[85vh] flex flex-col animate-fade-in-up" style={{ animationDuration: '0.2s' }} onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700/50 shrink-0">
                <span className="text-sm font-medium text-gray-200">{s.name}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleUse(s)} disabled={saving === s.slug}
                    className="px-3 py-1.5 text-xs text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-medium">
                    {saving === s.slug ? 'Loading...' : 'Use This Template'}
                  </button>
                  <button onClick={() => setPreviewSlug(null)} className="p-1.5 text-gray-500 hover:text-gray-300 rounded-lg hover:bg-white/5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-gray-200 flex justify-center p-6">
                <div style={{ width: '100%', maxWidth: '600px' }}>
                  <iframe srcDoc={previewHtml} className="w-full bg-white shadow-xl rounded-lg" style={{ minHeight: '600px', border: 'none' }} title="Preview" />
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
