import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  currentConversationId: null,
  // Maps local conversation ID to backend conversation ID
  backendConversationIds: {},
  messages: {},
  isLoading: false,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createConversation: (state, action) => {
      const newConversation = {
        id: action.payload.id || Date.now().toString(),
        title: action.payload.title || 'New Chat',
        timestamp: new Date().toISOString(),
        backendId: action.payload.backendId || null,
      };
      state.conversations.unshift(newConversation);
      state.currentConversationId = newConversation.id;
      state.messages[newConversation.id] = [];
      if (newConversation.backendId) {
        state.backendConversationIds[newConversation.id] = newConversation.backendId;
      }
    },

    setCurrentConversation: (state, action) => {
      state.currentConversationId = action.payload;
    },

    // Link a local conversation to its backend ID (after first API response)
    setBackendConversationId: (state, action) => {
      const { localId, backendId } = action.payload;
      state.backendConversationIds[localId] = backendId;
      // Also update the conversation object
      const conv = state.conversations.find(c => c.id === localId);
      if (conv) {
        conv.backendId = backendId;
      }
    },

    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push({
        id: Date.now().toString() + Math.random(),
        ...message,
        timestamp: new Date().toISOString(),
      });
    },

    // Load messages from API (for conversation history)
    setMessages: (state, action) => {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
    },

    // Load conversations from API — merge with existing, no duplicates
    setConversations: (state, action) => {
      const apiConversations = action.payload;

      // Build set of all known backend IDs
      const knownBackendIds = new Set();
      for (const conv of state.conversations) {
        if (conv.backendId) knownBackendIds.add(conv.backendId);
      }
      for (const [, backendId] of Object.entries(state.backendConversationIds)) {
        knownBackendIds.add(backendId);
      }

      for (const conv of apiConversations) {
        if (knownBackendIds.has(conv.id)) {
          // Already exists — update title if it changed
          const existing = state.conversations.find(c => c.backendId === conv.id);
          if (existing && conv.title && conv.title !== 'New Chat') {
            existing.title = conv.title;
          }
          continue;
        }

        // New conversation from API
        state.conversations.push({
          id: conv.id,
          title: conv.title || 'Chat',
          timestamp: conv.created_at || conv.updated_at || new Date().toISOString(),
          backendId: conv.id,
        });
        state.backendConversationIds[conv.id] = conv.id;
        knownBackendIds.add(conv.id);
      }
    },

    updateConversationTitle: (state, action) => {
      const { conversationId, title } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.title = title;
      }
    },

    deleteConversation: (state, action) => {
      state.conversations = state.conversations.filter(c => c.id !== action.payload);
      delete state.messages[action.payload];
      delete state.backendConversationIds[action.payload];
      if (state.currentConversationId === action.payload) {
        state.currentConversationId = state.conversations[0]?.id || null;
      }
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  createConversation,
  setCurrentConversation,
  setBackendConversationId,
  addMessage,
  setMessages,
  setConversations,
  updateConversationTitle,
  deleteConversation,
  setLoading,
} = chatSlice.actions;

export default chatSlice.reducer;
