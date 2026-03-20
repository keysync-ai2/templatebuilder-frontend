'use client';

import { useSelector, useDispatch } from 'react-redux';
import { createConversation, setCurrentConversation, deleteConversation, setMessages } from '@/store/slices/chatSlice';
import { setLeftPanel } from '@/store/slices/uiSlice';
import * as api from '@/lib/api';

export default function Sidebar() {
  const dispatch = useDispatch();
  const { conversations, currentConversationId, messages } = useSelector((state) => state.chat);
  const { leftPanelOpen } = useSelector((state) => state.ui);

  const handleNewChat = () => {
    dispatch(createConversation({
      id: Date.now().toString(),
      title: 'New Chat',
    }));
  };

  const closeSidebarOnMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      dispatch(setLeftPanel(false));
    }
  };

  const handleSelectConversation = async (id) => {
    dispatch(setCurrentConversation(id));
    closeSidebarOnMobile();

    // Load messages from API if we haven't already and this is a backend conversation
    const conv = conversations.find(c => c.id === id);
    const existingMessages = messages[id] || [];
    if (conv?.backendId && existingMessages.length === 0) {
      try {
        const data = await api.getConversation(conv.backendId);
        const apiMessages = (data.messages || []).map((m, i) => {
          if (m.role === 'user') {
            return {
              id: `api-${m.id || i}`,
              role: 'user',
              text: m.content,
              timestamp: m.created_at || new Date().toISOString(),
            };
          }
          // Assistant: build widgets array with text + any tool widgets
          const widgets = [];
          if (m.content) {
            widgets.push({ type: 'paragraph', data: { text: m.content } });
          }
          if (m.widgets && m.widgets.length > 0) {
            widgets.push(...m.widgets);
          }
          return {
            id: `api-${m.id || i}`,
            role: 'assistant',
            widgets: widgets.length > 0 ? widgets : [{ type: 'paragraph', data: { text: '(No response)' } }],
            timestamp: m.created_at || new Date().toISOString(),
          };
        });
        if (apiMessages.length > 0) {
          dispatch(setMessages({ conversationId: id, messages: apiMessages }));
        }
      } catch (err) {
        console.error('Failed to load conversation messages:', err);
      }
    }
  };

  const handleDeleteConversation = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Delete this conversation?')) return;

    // Delete from backend if it has a backend ID
    const conv = conversations.find(c => c.id === id);
    if (conv?.backendId) {
      try {
        await api.deleteConversation(conv.backendId);
      } catch (err) {
        console.error('Failed to delete conversation:', err);
      }
    }
    dispatch(deleteConversation(id));
  };

  if (!leftPanelOpen) return null;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        onClick={() => dispatch(setLeftPanel(false))}
      />

      <aside className="w-64 bg-[#0a0f1a]/95 md:bg-[#0a0f1a]/80 backdrop-blur-xl border-r border-gray-800/50 flex flex-col h-full fixed md:relative z-50 md:z-auto top-0 md:top-auto left-0 md:left-auto">
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-3 md:hidden">
          <span className="text-sm font-medium text-gray-300">Conversations</span>
          <button
            onClick={() => dispatch(setLeftPanel(false))}
            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3 pt-0 md:pt-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 glass rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:border-cyan-500/30 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        <h2 className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-3 py-2.5">
          History
        </h2>
        <div className="space-y-0.5">
          {conversations.length === 0 ? (
            <p className="text-xs text-gray-600 px-3 py-3">No conversations yet</p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group ${
                  currentConversationId === conversation.id
                    ? 'bg-white/5 text-gray-200 border border-gray-700/50'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <svg className={`w-3.5 h-3.5 shrink-0 ${currentConversationId === conversation.id ? 'text-cyan-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm truncate">{conversation.title}</p>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(e, conversation.id)}
                  className="opacity-0 group-hover:opacity-100 ml-1 p-1 hover:bg-red-500/10 rounded-lg transition-all"
                  aria-label="Delete conversation"
                >
                  <svg className="w-3.5 h-3.5 text-gray-600 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
    </>
  );
}
