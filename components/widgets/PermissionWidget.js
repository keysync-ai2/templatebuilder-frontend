'use client';

import { useState } from 'react';

export default function PermissionWidget({ data, onChoice }) {
  const { doc_id, tool_name, estimated_tokens, message } = data;
  const [chosen, setChosen] = useState(null);

  const handleChoice = (choice) => {
    setChosen(choice);
    if (onChoice) onChoice(doc_id, choice);
  };

  const tokensFormatted = estimated_tokens >= 1000
    ? `${Math.round(estimated_tokens / 1000)}K`
    : estimated_tokens;

  if (chosen) {
    return (
      <div className="glass rounded-2xl rounded-tl-md px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          {chosen === 'summarize'
            ? 'Summarizing large response...'
            : 'Skipping summarization — showing results directly.'
          }
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl rounded-tl-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-1">Large Response Detected</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{message}</p>
            <p className="text-[10px] text-gray-600 mt-1">Estimated size: ~{tokensFormatted} tokens from <span className="font-mono">{tool_name}</span></p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleChoice('summarize')}
            className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-medium rounded-xl transition-all btn-shine flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Summarize (~20s)
          </button>
          <button
            onClick={() => handleChoice('skip')}
            className="flex-1 py-2.5 glass text-gray-300 text-xs font-medium rounded-xl hover:text-white hover:border-gray-600 transition-all flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Skip — view raw
          </button>
        </div>
      </div>
    </div>
  );
}
