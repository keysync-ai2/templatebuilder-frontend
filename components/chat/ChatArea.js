'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import WidgetRenderer from '../widgets/WidgetRenderer';
import { setRightPanel } from '@/store/slices/uiSlice';

export default function ChatArea({ onSendPrompt }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentConversationId, messages, isLoading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState('');

  const currentMessages = currentConversationId ? messages[currentConversationId] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isLoading]);

  useEffect(() => {
    function handleStatus(e) {
      setStatusMessage(e.detail.message || '');
    }
    window.addEventListener('chat-status', handleStatus);
    return () => window.removeEventListener('chat-status', handleStatus);
  }, []);

  useEffect(() => {
    if (!isLoading) setStatusMessage('');
  }, [isLoading]);

  const handleImageExpand = (data) => {
    dispatch(setRightPanel({ open: true, content: { type: 'image', data } }));
  };

  const handleFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
  };

  const handlePromptClick = (prompt) => {
    if (onSendPrompt) onSendPrompt(prompt);
  };

  // ─── Landing / Empty State ───
  if (!currentConversationId || currentMessages.length === 0) {
    const firstName = (user?.name || '').split(' ')[0] || 'there';

    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Hero */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-white mb-2">
              Hey {firstName}, what shall we create?
            </h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
              I'm your AI email design assistant. Tell me what you need and I'll build professional, brand-aware email templates in seconds.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <button
              onClick={() => handlePromptClick('Create a professional welcome email for my business')}
              className="glass rounded-xl p-4 text-left hover:border-cyan-500/30 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3 group-hover:bg-cyan-500/20 transition-colors">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-200 mb-1">Create Template</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">Describe your email and get 5 customized suggestions</p>
            </button>

            <button
              onClick={() => router.push('/templates')}
              className="glass rounded-xl p-4 text-left hover:border-cyan-500/30 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-200 mb-1">My Templates</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">Browse, edit, and manage your saved templates</p>
            </button>

            <button
              onClick={() => router.push('/brand')}
              className="glass rounded-xl p-4 text-left hover:border-cyan-500/30 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition-colors">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-200 mb-1">Brand Profile</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">Set up your brand for personalized templates</p>
            </button>
          </div>

          {/* Suggested Prompts */}
          <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 text-center">Try these prompts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { text: 'Create a welcome email for new subscribers', icon: '👋' },
                { text: 'Build a flash sale email with 20% discount', icon: '🔥' },
                { text: 'Design a monthly newsletter template', icon: '📰' },
                { text: 'Create an event invitation email', icon: '🎉' },
                { text: 'Build a product launch announcement', icon: '🚀' },
                { text: 'Design an abandoned cart recovery email', icon: '🛒' },
              ].map(({ text, icon }) => (
                <button
                  key={text}
                  onClick={() => handlePromptClick(text)}
                  className="flex items-center gap-3 px-4 py-3 glass rounded-xl text-left hover:border-cyan-500/20 hover:bg-white/[0.02] transition-all group"
                >
                  <span className="text-lg shrink-0">{icon}</span>
                  <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] text-gray-600">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                30+ Templates
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Brand-Aware AI
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Outlook Compatible
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                MCP Integrations
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Chat Messages ───
  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
        {currentMessages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            style={{ animationDuration: '0.3s' }}
          >
            {/* Assistant avatar */}
            {message.role === 'assistant' && (
              <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/10 flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
            )}

            <div className={`max-w-2xl ${message.role === 'user' ? 'w-auto' : 'flex-1'}`}>
              {message.role === 'user' ? (
                <div className="bg-gradient-to-r from-cyan-600/90 to-blue-600/90 text-white rounded-2xl rounded-tr-md px-4 py-3 shadow-lg shadow-cyan-500/5">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                      {message.attachments.map((attachment, index) => (
                        <div key={index} className="text-xs opacity-75 flex items-center gap-1.5">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          {attachment.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {message.widgets ? (
                    message.widgets.map((widget, index) => (
                      <WidgetRenderer
                        key={index}
                        widget={widget}
                        onFormSubmit={handleFormSubmit}
                        onImageExpand={handleImageExpand}
                      />
                    ))
                  ) : (
                    <div className="glass rounded-2xl rounded-tl-md px-4 py-3">
                      <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    </div>
                  )}
                </div>
              )}
              <span className="text-[10px] text-gray-600 mt-1.5 block px-1">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* User avatar */}
            {message.role === 'user' && (
              <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mt-1 shadow-md shadow-cyan-500/15">
                <span className="text-white text-xs font-semibold">
                  {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Status indicator */}
        {isLoading && (
          <div className="flex gap-3 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
            <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-cyan-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div className="glass rounded-2xl rounded-tl-md px-5 py-3.5">
              {statusMessage ? (
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="text-sm text-gray-300 animate-pulse">{statusMessage}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-gray-500">Thinking...</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
