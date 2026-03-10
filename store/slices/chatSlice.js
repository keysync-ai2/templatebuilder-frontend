import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  currentConversationId: null,
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
      };
      state.conversations.unshift(newConversation);
      state.currentConversationId = newConversation.id;
      state.messages[newConversation.id] = [];
    },

    setCurrentConversation: (state, action) => {
      state.currentConversationId = action.payload;
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
  addMessage,
  updateConversationTitle,
  deleteConversation,
  setLoading,
} = chatSlice.actions;

export default chatSlice.reducer;
