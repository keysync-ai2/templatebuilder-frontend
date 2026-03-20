'use client';

import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ChatArea from '@/components/chat/ChatArea';
import ChatInput from '@/components/chat/ChatInput';
import {
  createConversation, addMessage, setLoading,
  setBackendConversationId, setConversations, updateConversationTitle,
} from '@/store/slices/chatSlice';
import { fetchMe } from '@/store/slices/authSlice';
import { parseCommand, getHelpText } from '@/lib/slashCommands';
import * as api from '@/lib/api';

export default function ChatPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentConversationId, conversations, backendConversationIds } = useSelector((state) => state.chat);
  const { user, initialized } = useSelector((state) => state.auth);

  // Keep a ref to always have the latest backend IDs (avoids stale closures)
  const backendIdsRef = useRef(backendConversationIds);
  useEffect(() => {
    backendIdsRef.current = backendConversationIds;
  }, [backendConversationIds]);

  useEffect(() => {
    const token = api.getAccessToken();
    if (!token) { router.push('/auth/login'); return; }
    if (!initialized) dispatch(fetchMe());
  }, [initialized, dispatch, router]);

  // Load conversation history from API on mount
  useEffect(() => {
    if (!user) return;
    loadConversationHistory();
  }, [user]);

  useEffect(() => {
    if (user && conversations.length === 0) {
      dispatch(createConversation({
        id: Date.now().toString(),
        title: 'New Chat',
      }));
    }
  }, [user, conversations.length]);

  async function loadConversationHistory() {
    try {
      const data = await api.listConversations();
      const convs = data.conversations || [];
      if (convs.length > 0) {
        dispatch(setConversations(convs));
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  }

  const handleSendMessage = async (messageData) => {
    if (!currentConversationId) return;

    dispatch(addMessage({
      conversationId: currentConversationId,
      message: {
        role: 'user',
        text: messageData.text,
        attachments: messageData.attachments,
      },
    }));

    dispatch(setLoading(true));

    try {
      // Get the backend conversation ID — use ref to avoid stale closure
      const backendConvId = backendIdsRef.current[currentConversationId] || null;

      const result = await api.sendChatMessage(messageData.text, backendConvId);

      // Store the backend conversation ID for future messages
      if (result.conversation_id && !backendConvId) {
        dispatch(setBackendConversationId({
          localId: currentConversationId,
          backendId: result.conversation_id,
        }));
        // Update title from first message
        dispatch(updateConversationTitle({
          conversationId: currentConversationId,
          title: messageData.text.substring(0, 50),
        }));
      }

      const widgets = [];
      if (result.message) {
        widgets.push({
          type: 'paragraph',
          data: { text: result.message, timestamp: new Date().toISOString() },
        });
      }
      if (result.widgets && result.widgets.length > 0) {
        for (const w of result.widgets) widgets.push(w);
      }

      dispatch(addMessage({
        conversationId: currentConversationId,
        message: { role: 'assistant', widgets },
      }));
    } catch (err) {
      dispatch(addMessage({
        conversationId: currentConversationId,
        message: {
          role: 'assistant',
          widgets: [{
            type: 'paragraph',
            data: { text: `Something went wrong: ${err.message}`, timestamp: new Date().toISOString() },
          }],
        },
      }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSlashCommand = async (text) => {
    if (!currentConversationId) return;

    const parsed = parseCommand(text);
    if (!parsed) return;

    const { command, args } = parsed;

    // Show the command in chat
    dispatch(addMessage({
      conversationId: currentConversationId,
      message: { role: 'user', text: text },
    }));

    // Frontend commands — instant, no API
    if (command === 'help') {
      dispatch(addMessage({
        conversationId: currentConversationId,
        message: { role: 'assistant', widgets: [{ type: 'paragraph', data: { text: getHelpText() } }] },
      }));
      return;
    }
    if (command === 'new') {
      try {
        const data = await api.createTemplate('Untitled Template', []);
        router.push(`/editor/${data.id}?from=chat`);
      } catch (err) {
        console.error('Failed to create template:', err);
      }
      return;
    }
    if (command === 'templates') {
      router.push('/templates');
      return;
    }
    if (command === 'brand' && !args) {
      router.push('/brand');
      return;
    }

    // Backend commands — call API
    dispatch(setLoading(true));
    try {
      const result = await api.sendChatCommand(command, args);
      const widgets = [];
      if (result.message) {
        widgets.push({ type: 'paragraph', data: { text: result.message } });
      }
      if (result.widget_type && result.widget_data) {
        widgets.push({ type: result.widget_type, data: result.widget_data });
      }
      dispatch(addMessage({
        conversationId: currentConversationId,
        message: { role: 'assistant', widgets },
      }));
    } catch (err) {
      dispatch(addMessage({
        conversationId: currentConversationId,
        message: { role: 'assistant', widgets: [{ type: 'paragraph', data: { text: `Command failed: ${err.message}` } }] },
      }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!initialized || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#030712]">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#030712] noise">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <ChatArea onSendPrompt={(text) => handleSendMessage({ text, attachments: [] })} />
          <ChatInput onSend={handleSendMessage} onSlashCommand={handleSlashCommand} />
        </div>
      </div>
    </div>
  );
}
