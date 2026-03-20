'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchMe } from '@/store/slices/authSlice';
import { fetchBrand, saveBrand } from '@/store/slices/brandSlice';
import Header from '@/components/layout/Header';
import * as api from '@/lib/api';

const INDUSTRIES = [
  { value: 'saas', label: 'SaaS / Software' },
  { value: 'ecommerce', label: 'E-commerce / Retail' },
  { value: 'health', label: 'Health & Fitness' },
  { value: 'food', label: 'Food & Restaurant' },
  { value: 'education', label: 'Education' },
  { value: 'events', label: 'Events & Conferences' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'agency', label: 'Agency / Consulting' },
  { value: 'other', label: 'Other' },
];

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'playful', label: 'Playful' },
  { value: 'minimal', label: 'Minimal' },
];

export default function BrandPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, initialized } = useSelector((state) => state.auth);
  const { profile, hasProfile, saving, initialized: brandInit } = useSelector((state) => state.brand);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    business_name: '',
    tagline: '',
    website_url: '',
    description: '',
    primary_color: '#2563EB',
    secondary_color: '#1E40AF',
    industry: 'other',
    tone: 'professional',
    features: '',
  });

  useEffect(() => {
    const token = api.getAccessToken();
    if (!token) { router.push('/auth/login'); return; }
    if (!initialized) dispatch(fetchMe());
  }, [initialized, dispatch, router]);

  useEffect(() => {
    if (user && !brandInit) dispatch(fetchBrand());
  }, [user, brandInit, dispatch]);

  // Populate form from profile
  useEffect(() => {
    if (profile) {
      setForm({
        business_name: profile.business_name || '',
        tagline: profile.tagline || '',
        website_url: profile.website_url || '',
        description: profile.description || '',
        primary_color: profile.primary_color || '#2563EB',
        secondary_color: profile.secondary_color || '#1E40AF',
        industry: profile.industry || 'other',
        tone: profile.tone || 'professional',
        features: (profile.features || []).join(', '),
      });
    }
  }, [profile]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    const payload = {
      ...form,
      features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
    };
    const result = await dispatch(saveBrand(payload));
    if (result.meta.requestStatus === 'fulfilled') {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

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
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Brand Profile</h2>
              <p className="text-gray-500 text-sm mt-1">
                {hasProfile ? 'Update your brand details. Templates will inherit these settings.' : 'Set up your brand to personalize templates.'}
              </p>
            </div>
            {saved && (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </span>
            )}
          </div>

          <div className="space-y-6">
            {/* Business Info */}
            <section className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Business Info</h3>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Business Name *</label>
                <input value={form.business_name} onChange={(e) => update('business_name', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 input-glow" placeholder="Acme Inc." />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Tagline</label>
                <input value={form.tagline} onChange={(e) => update('tagline', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 input-glow" placeholder="Your catchy tagline" />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Website</label>
                <input value={form.website_url} onChange={(e) => update('website_url', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 input-glow" placeholder="https://example.com" />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 input-glow resize-none" placeholder="Brief description of your business" />
              </div>
            </section>

            {/* Colors & Style */}
            <section className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Colors & Style</h3>

              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1.5">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.primary_color} onChange={(e) => update('primary_color', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-700 cursor-pointer bg-transparent" />
                    <input value={form.primary_color} onChange={(e) => update('primary_color', e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-900/80 border border-gray-700/50 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1.5">Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.secondary_color} onChange={(e) => update('secondary_color', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-700 cursor-pointer bg-transparent" />
                    <input value={form.secondary_color} onChange={(e) => update('secondary_color', e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-900/80 border border-gray-700/50 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-500" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Industry</label>
                <select value={form.industry} onChange={(e) => update('industry', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 appearance-none">
                  {INDUSTRIES.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">Tone</label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button key={t.value} onClick={() => update('tone', t.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        form.tone === t.value
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-gray-800 text-gray-400 border border-gray-700/50 hover:border-gray-600'
                      }`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Key Features</h3>
              <textarea value={form.features} onChange={(e) => update('features', e.target.value)} rows={3}
                className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 input-glow resize-none" placeholder="Fast shipping, 24/7 support, free returns" />
              <p className="text-[10px] text-gray-600">Comma-separated. Used by AI for content generation and template suggestions.</p>
            </section>

            {/* Save */}
            <div className="flex justify-end">
              <button onClick={handleSave} disabled={saving || !form.business_name.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-all btn-shine shadow-lg shadow-cyan-500/10">
                {saving ? 'Saving...' : 'Save Brand Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
