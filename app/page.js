'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import RightPanel from '@/components/layout/RightPanel';
import ChatArea from '@/components/chat/ChatArea';
import ChatInput from '@/components/chat/ChatInput';
import { createConversation, addMessage, setLoading } from '@/store/slices/chatSlice';
import { fetchMe } from '@/store/slices/authSlice';
import * as api from '@/lib/api';

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentConversationId, conversations } = useSelector((state) => state.chat);
  const { user, initialized } = useSelector((state) => state.auth);

  // Auth check
  useEffect(() => {
    const token = api.getAccessToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }
    if (!initialized) {
      dispatch(fetchMe());
    }
  }, [initialized, dispatch, router]);

  useEffect(() => {
    // Create initial conversation if none exists
    if (conversations.length === 0) {
      dispatch(createConversation({
        id: Date.now().toString(),
        title: 'New Chat',
      }));
    }
  }, []);

  const handleSendMessage = async (messageData) => {
    if (!currentConversationId) return;

    // Add user message to UI
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
      // Call the real chat API
      const result = await api.sendChatMessage(
        messageData.text,
        null, // conversation_id — let backend create/manage
      );

      // Build widgets array from API response
      const widgets = [];

      // Add text content as paragraph widget
      if (result.message) {
        widgets.push({
          type: 'paragraph',
          data: {
            text: result.message,
            timestamp: new Date().toISOString(),
          },
        });
      }

      // Add any widgets from the API (template-builder, etc.)
      if (result.widgets && result.widgets.length > 0) {
        for (const w of result.widgets) {
          widgets.push(w);
        }
      }

      dispatch(addMessage({
        conversationId: currentConversationId,
        message: {
          role: 'assistant',
          widgets,
        },
      }));
    } catch (err) {
      // Show error as assistant message
      dispatch(addMessage({
        conversationId: currentConversationId,
        message: {
          role: 'assistant',
          widgets: [{
            type: 'paragraph',
            data: {
              text: `Sorry, something went wrong: ${err.message}`,
              timestamp: new Date().toISOString(),
            },
          }],
        },
      }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!initialized || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatArea />
          <ChatInput onSend={handleSendMessage} />
        </div>
        <RightPanel />
      </div>
    </div>
  );
}
