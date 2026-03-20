'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchMe } from '@/store/slices/authSlice';
import { fetchBrand } from '@/store/slices/brandSlice';
import { loadTemplate } from '@/store/slices/emailBuilderSlice';
import Header from '@/components/layout/Header';
import BrandOnboardingModal from '@/components/brand/BrandOnboardingModal';
import SuggestionModal from '@/components/suggest/SuggestionModal';
import * as api from '@/lib/api';

export default function TemplatesPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, initialized } = useSelector((state) => state.auth);
  const { hasProfile, initialized: brandInit } = useSelector((state) => state.brand);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  useEffect(() => {
    const token = api.getAccessToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }
    if (!initialized) {
      dispatch(fetchMe());
    }
  }, [initialized, dispatch, router]);

  useEffect(() => {
    if (!user) return;
    loadTemplates();
    dispatch(fetchBrand());
  }, [user]);

  // Show onboarding if no brand profile
  useEffect(() => {
    if (brandInit && !hasProfile && user) {
      setShowBrandModal(true);
    }
  }, [brandInit, hasProfile, user]);

  async function loadTemplates() {
    try {
      const data = await api.listTemplates();
      setTemplates(data.templates || []);
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleNew() {
    try {
      const data = await api.createTemplate('Untitled Template', []);
      router.push(`/editor/${data.id}`);
    } catch (err) {
      console.error('Failed to create template:', err);
    }
  }

  async function handleOpen(id) {
    try {
      const data = await api.getTemplate(id);
      dispatch(loadTemplate({
        templateName: data.templateName,
        templateSubject: data.templateSubject,
        components: data.components,
      }));
      router.push(`/editor/${id}`);
    } catch (err) {
      console.error('Failed to load template:', err);
    }
  }

  async function handleDelete(id, e) {
    e.stopPropagation();
    if (!confirm('Delete this template? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await api.deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Failed to delete template:', err);
    } finally {
      setDeleting(null);
    }
  }

  if (!initialized || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#030712]">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col noise">
      <Header />

      <div className="flex-1 overflow-auto">
        {/* Hero section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-6 sm:pb-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-1">Templates</h2>
                <p className="text-gray-500 text-sm">
                  {templates.length > 0
                    ? `${templates.length} template${templates.length === 1 ? '' : 's'}`
                    : 'Create your first email template'}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowSuggestModal(true)}
                  className="px-4 sm:px-5 py-2.5 glass rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:border-cyan-500/30 transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden sm:inline">Find a Template</span>
                  <span className="sm:hidden">Find</span>
                </button>
                <button
                  onClick={handleNew}
                  className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 btn-shine shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline">New Template</span>
                  <span className="sm:hidden">New</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-24 animate-fade-in-up">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-300 mb-2">No templates yet</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Design professional email templates with our drag-and-drop builder and AI assistant.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleNew}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-medium transition-all duration-300 btn-shine shadow-lg shadow-cyan-500/10"
                >
                  Create Template
                </button>
                <button
                  onClick={() => router.push('/chat')}
                  className="px-6 py-3 glass rounded-xl text-gray-300 hover:text-white font-medium transition-all duration-300 hover:border-gray-600"
                >
                  Ask AI to Build
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
              {templates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleOpen(t.id)}
                  className="template-card glass rounded-2xl p-6 cursor-pointer group animate-fade-in-up"
                  style={{ opacity: 0 }}
                >
                  {/* Preview placeholder */}
                  <div className="h-36 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/30 mb-4 flex items-center justify-center overflow-hidden group-hover:border-cyan-500/20 transition-colors">
                    <div className="flex flex-col items-center gap-2 text-gray-600 group-hover:text-gray-500 transition-colors">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      <span className="text-xs">Preview</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-200 group-hover:text-white truncate transition-colors">
                        {t.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {t.updated_at ? new Date(t.updated_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        }) : ''}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(t.id, e)}
                      disabled={deleting === t.id}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all ml-2 shrink-0"
                      title="Delete template"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {/* New template card */}
              <div
                onClick={handleNew}
                className="template-card rounded-2xl p-6 cursor-pointer border-2 border-dashed border-gray-800 hover:border-cyan-500/30 flex flex-col items-center justify-center min-h-[260px] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-800/50 group-hover:bg-cyan-500/10 flex items-center justify-center mb-3 transition-colors">
                  <svg className="w-6 h-6 text-gray-600 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 group-hover:text-gray-400 font-medium transition-colors">New Template</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Brand onboarding modal */}
      {showBrandModal && (
        <BrandOnboardingModal onClose={() => setShowBrandModal(false)} />
      )}

      {/* Suggestion modal */}
      {showSuggestModal && (
        <SuggestionModal onClose={() => setShowSuggestModal(false)} />
      )}
    </div>
  );
}
