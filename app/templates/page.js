'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchMe } from '@/store/slices/authSlice';
import { loadTemplate } from '@/store/slices/emailBuilderSlice';
import Header from '@/components/layout/Header';
import * as api from '@/lib/api';

export default function TemplatesPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, initialized } = useSelector((state) => state.auth);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  // Auth check
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

  // Fetch templates
  useEffect(() => {
    if (!user) return;
    loadTemplates();
  }, [user]);

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
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 w-full flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">My Templates</h2>
          <button
            onClick={handleNew}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Template
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No templates yet</h3>
            <p className="text-gray-500 mb-6">Create your first email template to get started.</p>
            <button
              onClick={handleNew}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Create Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((t) => (
              <div
                key={t.id}
                onClick={() => handleOpen(t.id)}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 cursor-pointer hover:border-blue-500/50 hover:bg-gray-800/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <button
                    onClick={(e) => handleDelete(t.id, e)}
                    disabled={deleting === t.id}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                    title="Delete template"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <h3 className="font-medium text-white mb-1 truncate">{t.name}</h3>
                <p className="text-xs text-gray-500">
                  {t.updated_at ? new Date(t.updated_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  }) : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
