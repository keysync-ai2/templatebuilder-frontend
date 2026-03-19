'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ChatArea from '@/components/chat/ChatArea';
import ChatInput from '@/components/chat/ChatInput';
import { createConversation, addMessage, setLoading } from '@/store/slices/chatSlice';
import { fetchMe } from '@/store/slices/authSlice';
import * as api from '@/lib/api';

export default function ChatPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentConversationId, conversations } = useSelector((state) => state.chat);
  const { user, initialized } = useSelector((state) => state.auth);

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
    if (conversations.length === 0) {
      dispatch(createConversation({
        id: Date.now().toString(),
        title: 'New Chat',
      }));
    }
  }, []);

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
      const result = await api.sendChatMessage(messageData.text, null);

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
          <ChatArea />
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
