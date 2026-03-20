'use client';

import { useState, useRef, useEffect } from 'react';
import { filterCommands } from '@/lib/slashCommands';
import SlashAutocomplete from './SlashAutocomplete';

export default function ChatInput({ onSend, onSlashCommand, disabled }) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [slashMatches, setSlashMatches] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '24px';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, [message]);

  // Slash command detection
  useEffect(() => {
    if (message.startsWith('/')) {
      const firstWord = message.split(/\s/)[0];
      const matches = filterCommands(firstWord);
      setSlashMatches(matches);
      setSelectedIdx(0);
    } else {
      setSlashMatches([]);
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      // Check if it's a slash command
      if (message.startsWith('/') && onSlashCommand) {
        onSlashCommand(message.trim());
      } else {
        onSend({ text: message, attachments });
      }
      setMessage('');
      setAttachments([]);
      setSlashMatches([]);
    }
  };

  const handleKeyDown = (e) => {
    // Autocomplete navigation
    if (slashMatches.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((prev) => Math.min(prev + 1, slashMatches.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((prev) => Math.max(prev - 1, 0));
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        handleSelectCommand(slashMatches[selectedIdx]);
        return;
      }
      if (e.key === 'Escape') {
        setSlashMatches([]);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSelectCommand = (cmd) => {
    // Fill the input with the command + space for args
    setMessage(cmd.name + (cmd.args ? ' ' : ''));
    setSlashMatches([]);
    textareaRef.current?.focus();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const newAttachments = files.map(file => ({
      name: file.name, size: file.size, type: file.type, file,
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const hasContent = message.trim() || attachments.length > 0;
  const isSlash = message.startsWith('/');

  return (
    <div className="p-4 pb-5 relative">
      <div className="max-w-3xl mx-auto relative">
        {/* Slash autocomplete dropdown */}
        <SlashAutocomplete
          commands={slashMatches}
          selectedIndex={selectedIdx}
          onSelect={handleSelectCommand}
        />

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="flex items-center gap-2 glass rounded-lg px-3 py-1.5 text-xs">
                <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span className="text-gray-300">{attachment.name}</span>
                <button onClick={() => removeAttachment(index)} className="text-gray-500 hover:text-red-400 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input bar */}
        <form
          onSubmit={handleSubmit}
          className={`flex items-end gap-2 glass rounded-2xl px-3 py-2.5 transition-all duration-300 ${
            isFocused ? 'border-cyan-500/30 shadow-lg shadow-cyan-500/5' : ''
          } ${isSlash ? 'border-purple-500/30' : ''}`}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="shrink-0 p-2 text-gray-500 hover:text-gray-300 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isSlash ? 'Type a command...' : 'Describe the email template you want...'}
            disabled={disabled}
            rows={1}
            className={`flex-1 bg-transparent text-sm placeholder-gray-600 focus:outline-none resize-none py-1.5 leading-relaxed disabled:opacity-30 max-h-40 ${
              isSlash ? 'text-purple-300 font-mono' : 'text-gray-100'
            }`}
          />

          <button
            type="submit"
            disabled={disabled || !hasContent}
            className={`shrink-0 p-2.5 rounded-xl transition-all duration-300 ${
              hasContent
                ? isSlash
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/15'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/15 hover:shadow-cyan-500/25'
                : 'text-gray-600'
            } disabled:opacity-30`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>

        <p className="text-[10px] text-gray-700 text-center mt-2">
          {isSlash ? 'Tab to autocomplete, Enter to run' : 'Press Enter to send, Shift+Enter for new line, / for commands'}
        </p>
      </div>
    </div>
  );
}
