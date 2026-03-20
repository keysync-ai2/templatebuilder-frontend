'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveBrand } from '@/store/slices/brandSlice';

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

export default function BrandOnboardingModal({ onClose }) {
  const dispatch = useDispatch();
  const { saving } = useSelector((state) => state.brand);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    business_name: '',
    tagline: '',
    website_url: '',
    primary_color: '#2563EB',
    secondary_color: '#1E40AF',
    industry: 'other',
    tone: 'professional',
    features: '',
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    const payload = {
      ...form,
      features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
    };
    const result = await dispatch(saveBrand(payload));
    if (result.meta.requestStatus === 'fulfilled') {
      onClose();
    }
  };

  const canNext = step === 1 ? form.business_name.trim() : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
      <div className="bg-[#0a0f1a] rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-lg animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-white">Set up your brand</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-300 p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500">Step {step} of 3 — Templates will inherit your brand automatically</p>
          <div className="flex gap-1 mt-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-cyan-500' : 'bg-gray-700'} transition-colors`} />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Business Name *</label>
                <input
                  value={form.business_name}
                  onChange={(e) => update('business_name', e.target.value)}
                  placeholder="Acme Inc."
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 input-glow transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Tagline</label>
                <input
                  value={form.tagline}
                  onChange={(e) => update('tagline', e.target.value)}
                  placeholder="Your catchy tagline"
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 input-glow transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Website</label>
                <input
                  value={form.website_url}
                  onChange={(e) => update('website_url', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 input-glow transition-all"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Brand Colors</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] text-gray-500 mb-1 block">Primary</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.primary_color}
                        onChange={(e) => update('primary_color', e.target.value)}
                        className="w-10 h-10 rounded-lg border border-gray-700 cursor-pointer bg-transparent"
                      />
                      <input
                        value={form.primary_color}
                        onChange={(e) => update('primary_color', e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-900/80 border border-gray-700/50 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-gray-500 mb-1 block">Secondary</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.secondary_color}
                        onChange={(e) => update('secondary_color', e.target.value)}
                        className="w-10 h-10 rounded-lg border border-gray-700 cursor-pointer bg-transparent"
                      />
                      <input
                        value={form.secondary_color}
                        onChange={(e) => update('secondary_color', e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-900/80 border border-gray-700/50 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Industry</label>
                <select
                  value={form.industry}
                  onChange={(e) => update('industry', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 appearance-none"
                >
                  {INDUSTRIES.map((i) => (
                    <option key={i.value} value={i.value}>{i.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Tone</label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => update('tone', t.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        form.tone === t.value
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-gray-800 text-gray-400 border border-gray-700/50 hover:border-gray-600'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Key Features / Highlights</label>
                <textarea
                  value={form.features}
                  onChange={(e) => update('features', e.target.value)}
                  placeholder="Fast shipping, 24/7 support, free returns"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 input-glow transition-all resize-none"
                />
                <p className="text-[10px] text-gray-600 mt-1">Comma-separated. Used by AI for content generation.</p>
              </div>

              {/* Preview */}
              <div className="glass rounded-xl p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-3">Brand Preview</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: form.primary_color }}>
                    {form.business_name.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{form.business_name || 'Your Brand'}</h3>
                    {form.tagline && <p className="text-[10px] text-gray-400">{form.tagline}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: form.primary_color }} />
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: form.secondary_color }} />
                  <span className="text-[10px] text-gray-500 ml-1">
                    {INDUSTRIES.find((i) => i.value === form.industry)?.label} · {TONES.find((t) => t.value === form.tone)?.label}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="text-sm text-gray-400 hover:text-white transition-colors">
              Back
            </button>
          ) : (
            <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Skip for now
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canNext}
              className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-all btn-shine"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving || !form.business_name.trim()}
              className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-all btn-shine"
            >
              {saving ? 'Saving...' : 'Save Brand'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
