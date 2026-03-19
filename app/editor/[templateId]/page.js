'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loadTemplate } from '@/store/slices/emailBuilderSlice';
import dynamic from 'next/dynamic';

const EmailTemplateBuilder = dynamic(
  () => import('@/components/email-builder/EmailTemplateBuilder'),
  { ssr: false }
);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function EditorPage() {
  const { templateId } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!templateId) return;

    async function fetchTemplate() {
      try {
        const res = await fetch(`${API_URL}/api/templates/public/${templateId}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          setError(json.message || 'Template not found');
          setLoading(false);
          return;
        }

        dispatch(loadTemplate({
          templateName: json.data.templateName,
          templateSubject: json.data.templateSubject,
          components: json.data.components,
        }));

        setLoading(false);
      } catch (err) {
        setError('Failed to load template');
        setLoading(false);
      }
    }

    fetchTemplate();
  }, [templateId, dispatch]);

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

  return (
    <div className="h-screen bg-gray-950">
      <EmailTemplateBuilder />
    </div>
  );
}
