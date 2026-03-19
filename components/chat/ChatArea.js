'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import WidgetRenderer from '../widgets/WidgetRenderer';
import { setRightPanel } from '@/store/slices/uiSlice';

export default function ChatArea() {
  const dispatch = useDispatch();
  const { currentConversationId, messages, isLoading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  const currentMessages = currentConversationId ? messages[currentConversationId] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isLoading]);

  const handleImageExpand = (data) => {
    dispatch(setRightPanel({ open: true, content: { type: 'image', data } }));
  };

  const handleFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
  };

  // Empty state
  if (!currentConversationId || currentMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-lg px-6 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-200 mb-2">
            AI Email Assistant
          </h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Describe the email you want to create and I&apos;ll build it for you with production-ready HTML.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Create a welcome email for my SaaS',
              'Build a product launch announcement',
              'Design a newsletter template',
            ].map((suggestion) => (
              <button
                key={suggestion}
                className="px-3.5 py-2 text-xs text-gray-400 glass rounded-xl hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
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

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-3 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
            <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div className="glass rounded-2xl rounded-tl-md px-5 py-4">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
