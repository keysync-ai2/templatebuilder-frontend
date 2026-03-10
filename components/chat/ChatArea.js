'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import WidgetRenderer from '../widgets/WidgetRenderer';
import { setRightPanel } from '@/store/slices/uiSlice';

export default function ChatArea() {
  const dispatch = useDispatch();
  const { currentConversationId, messages, isLoading } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);

  const currentMessages = currentConversationId ? messages[currentConversationId] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleImageExpand = (data) => {
    dispatch(setRightPanel({
      open: true,
      content: { type: 'image', data },
    }));
  };

  const handleFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
    // You can add logic to send form data back to the backend
  };

  if (!currentConversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">TB</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            Welcome to Template Builder
          </h2>
          <p className="text-gray-400 mb-6">
            Start a new conversation to begin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-950 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {currentMessages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No messages yet. Start typing to begin!</p>
          </div>
        ) : (
          currentMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-3xl ${message.role === 'user' ? 'w-auto' : 'w-full'}`}>
                {message.role === 'user' ? (
                  <div className="bg-blue-600 text-white rounded-lg px-4 py-3 inline-block">
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="text-sm opacity-75">
                            📎 {attachment.name}
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
                      <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-100 whitespace-pre-wrap">{message.text}</p>
                      </div>
                    )}
                  </div>
                )}
                <span className="text-xs text-gray-600 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg px-4 py-3">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
