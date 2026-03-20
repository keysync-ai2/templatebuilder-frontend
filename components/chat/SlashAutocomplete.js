'use client';

import { useEffect, useState } from 'react';

export default function SlashAutocomplete({ commands, selectedIndex, onSelect }) {
  if (!commands || commands.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 mx-auto max-w-3xl">
      <div className="glass rounded-xl shadow-2xl shadow-black/40 py-1 overflow-hidden animate-fade-in-up" style={{ animationDuration: '0.1s' }}>
        <div className="px-3 py-1.5 border-b border-gray-700/50">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Commands</span>
        </div>
        {commands.map((cmd, idx) => (
          <button
            key={cmd.name}
            onClick={() => onSelect(cmd)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
              idx === selectedIndex
                ? 'bg-cyan-500/10 border-l-2 border-cyan-400'
                : 'border-l-2 border-transparent hover:bg-white/[0.03]'
            }`}
          >
            <span className={`text-sm font-mono font-medium ${idx === selectedIndex ? 'text-cyan-400' : 'text-gray-300'}`}>
              {cmd.name}
            </span>
            {cmd.args && (
              <span className="text-[10px] text-gray-600 font-mono">{cmd.args}</span>
            )}
            <span className="text-[11px] text-gray-500 ml-auto">{cmd.description}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
              cmd.type === 'frontend'
                ? 'bg-green-500/10 text-green-400'
                : 'bg-blue-500/10 text-blue-400'
            }`}>
              {cmd.type === 'frontend' ? 'instant' : 'api'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
