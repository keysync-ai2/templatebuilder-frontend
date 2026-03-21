'use client';

import { useEffect, useState } from 'react';
import * as api from '@/lib/api';

export default function TokenUsage() {
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    loadUsage();
    // Refresh every 30s
    const interval = setInterval(loadUsage, 30000);
    return () => clearInterval(interval);
  }, []);

  // Listen for updates from chat responses
  useEffect(() => {
    function handleUpdate(e) {
      if (e.detail?.token_usage) {
        setUsage(e.detail.token_usage);
      }
    }
    window.addEventListener('token-usage-update', handleUpdate);
    return () => window.removeEventListener('token-usage-update', handleUpdate);
  }, []);

  async function loadUsage() {
    try {
      const data = await api.getTokenUsage();
      setUsage(data);
    } catch {
      // Silent fail
    }
  }

  if (!usage || usage.total === 0) return null;

  const pct = usage.percentage;
  const totalFormatted = usage.total >= 1000000
    ? `${(usage.total / 1000000).toFixed(1)}M`
    : usage.total >= 1000
    ? `${(usage.total / 1000).toFixed(0)}K`
    : usage.total;
  const limitFormatted = `${(usage.limit / 1000000).toFixed(0)}M`;

  return (
    <div className="flex items-center gap-2 text-[10px] text-gray-500">
      <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-500' : 'bg-cyan-500'
          }`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className={pct >= 80 ? (pct >= 100 ? 'text-red-400' : 'text-yellow-400') : ''}>
        {totalFormatted} / {limitFormatted}
      </span>
    </div>
  );
}
