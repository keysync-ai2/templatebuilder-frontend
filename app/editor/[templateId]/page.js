'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loadTemplate } from '@/store/slices/emailBuilderSlice';
import * as api from '@/lib/api';
import dynamic from 'next/dynamic';

const EmailTemplateBuilder = dynamic(
  () => import('@/components/email-builder/EmailTemplateBuilder'),
  { ssr: false }
);

export default function EditorPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const { templateId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { components, templateName, templateSubject } = useSelector(
    (state) => state.emailBuilder
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [isOwned, setIsOwned] = useState(false);
  const backTo = searchParams.get('from') === 'chat' ? '/chat' : '/templates';

  useEffect(() => {
    if (!templateId) return;
    fetchTemplate();
  }, [templateId]);

  async function fetchTemplate() {
    // Try authenticated load first (user's own template)
    const token = api.getAccessToken();
    if (token) {
      try {
        const data = await api.getTemplate(templateId);
        dispatch(loadTemplate({
          templateName: data.templateName,
          templateSubject: data.templateSubject,
          components: data.components,
        }));
        setIsOwned(true);
        setTimeout(() => setLoading(false), 100);
        return;
      } catch {
        // Not owned by user or not logged in — try public
      }
    }

    // Fallback: public load (MCP-generated templates)
    try {
      const data = await api.getPublicTemplate(templateId);
      dispatch(loadTemplate({
        templateName: data.templateName,
        templateSubject: data.templateSubject,
        components: data.components,
      }));
      setIsOwned(false);
      setTimeout(() => setLoading(false), 100);
    } catch (err) {
      setError(err.message || 'Template not found');
      setLoading(false);
    }
  }

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    setSaved(false);
    try {
      if (isOwned) {
        await api.updateTemplate(templateId, {
          name: templateName,
          subject: templateSubject,
          components,
        });
      } else {
        // Save as new template for logged-in user
        const token = api.getAccessToken();
        if (!token) {
          router.push('/auth/login');
          return;
        }
        await api.createTemplate(templateName, components, templateSubject);
        setIsOwned(true);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  }, [saving, isOwned, templateId, templateName, templateSubject, components, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading template...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">Template Not Found</h2>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#030712] noise px-6">
        <div className="glass rounded-2xl p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/10 flex items-center justify-center">
            <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">Desktop Only</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Email editor is available on desktop only. Please switch to a desktop browser for the full editing experience.
          </p>
          <button
            onClick={() => router.push('/templates')}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-sm font-medium transition-all duration-300 btn-shine shadow-lg shadow-cyan-500/10"
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-950 flex flex-col">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(backTo)}
            className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded transition-colors"
            title={backTo === '/chat' ? 'Back to chat' : 'Back to templates'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <span className="text-sm text-gray-300 font-medium truncate max-w-xs">
            {templateName || 'Untitled Template'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Builder */}
      <div className="flex-1 overflow-hidden">
        <EmailTemplateBuilder />
      </div>
    </div>
  );
}
