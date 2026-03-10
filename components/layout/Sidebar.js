'use client';

import { useSelector, useDispatch } from 'react-redux';
import { createConversation, setCurrentConversation, deleteConversation } from '@/store/slices/chatSlice';

export default function Sidebar() {
  const dispatch = useDispatch();
  const { conversations, currentConversationId } = useSelector((state) => state.chat);
  const { leftPanelOpen } = useSelector((state) => state.ui);

  const handleNewChat = () => {
    dispatch(createConversation({
      id: Date.now().toString(),
      title: 'New Chat',
    }));
  };

  const handleSelectConversation = (id) => {
    dispatch(setCurrentConversation(id));
  };

  const handleDeleteConversation = (e, id) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      dispatch(deleteConversation(id));
    }
  };

  if (!leftPanelOpen) return null;

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
          History
        </h2>
        <div className="space-y-1">
          {conversations.length === 0 ? (
            <p className="text-sm text-gray-500 px-3 py-2">No conversations yet</p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors group ${
                  currentConversationId === conversation.id
                    ? 'bg-gray-800 text-gray-100'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{conversation.title}</p>
                  <p className="text-xs text-gray-600 truncate">
                    {new Date(conversation.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(e, conversation.id)}
                  className="opacity-0 group-hover:opacity-100 ml-2 p-1 hover:bg-gray-700 rounded transition-opacity"
                  aria-label="Delete conversation"
                >
                  <svg className="w-4 h-4 text-gray-500 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
