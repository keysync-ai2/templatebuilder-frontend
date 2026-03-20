'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { loadTemplate } from '@/store/slices/emailBuilderSlice';
import * as api from '@/lib/api';

export default function SuggestionModal({ onClose }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [saving, setSaving] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSuggestions(null);
    try {
      const data = await api.suggestTemplates(query.trim());
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Suggestion failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async (suggestion) => {
    setSaving(suggestion.slug);
    try {
      // Save as user's template
      const result = await api.createTemplate(
        suggestion.name,
        suggestion.components,
        '',
      );
      // Load into editor
      dispatch(loadTemplate({
        templateName: suggestion.name,
        templateSubject: '',
        components: suggestion.components,
      }));
      onClose();
      router.push(`/editor/${result.id}`);
    } catch (err) {
      console.error('Failed to use template:', err);
    } finally {
      setSaving(null);
    }
  };

  const QUICK_PROMPTS = [
    'Welcome email for new users',
    'Product launch announcement',
    'Flash sale with discount',
    'Monthly newsletter',
    'Event invitation',
    'Thank you email',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="bg-[#0a0f1a] rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-700/50 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Find a Template</h2>
              <p className="text-xs text-gray-500 mt-1">Describe the email you want and we'll find the best match</p>
            </div>
            <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Summer sale email for my clothing store..."
              className="flex-1 px-4 py-2.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 input-glow"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-all btn-shine"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Quick prompts */}
          {!suggestions && (
            <div className="flex flex-wrap gap-2 mt-3">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => { setQuery(prompt); }}
                  className="px-2.5 py-1 text-[10px] text-gray-500 glass rounded-lg hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-500">Searching templates...</p>
            </div>
          ) : suggestions && suggestions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestions.map((s) => (
                <div key={s.slug} className="glass rounded-xl overflow-hidden group hover:border-cyan-500/30 transition-all">
                  {/* Score badge */}
                  <div className="px-4 pt-3 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <span className="text-[9px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 font-semibold uppercase">{s.industry}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-semibold uppercase">{s.purpose}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">{Math.round(s.score * 100)}% match</span>
                  </div>

                  {/* Info */}
                  <div className="p-4 pt-2">
                    <h3 className="text-sm font-semibold text-gray-200 mb-1">{s.name}</h3>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-3">{s.description}</p>

                    <button
                      onClick={() => handleUseTemplate(s)}
                      disabled={saving === s.slug}
                      className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-all btn-shine"
                    >
                      {saving === s.slug ? 'Loading...' : 'Use This Template'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : suggestions && suggestions.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-sm mb-4">No matching templates found</p>
              <p className="text-gray-600 text-xs">Try a different description or let AI generate one for you</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
