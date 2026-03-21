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
import { toggleLeftPanel } from '@/store/slices/uiSlice';
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

      // Check if needs permission (large response)
      if (result.needs_permission) {
        pendingTaskRef.current = { taskId: result.task_id, docId: result.pending_doc_id };
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

  const pendingTaskRef = useRef(null);

  const handlePermissionChoice = async (docId, choice) => {
    const pending = pendingTaskRef.current;
    if (!pending) return;

    dispatch(setLoading(true));
    try {
      await api.sendPermissionChoice(pending.taskId, docId, choice);

      // Resume polling for the same task
      const maxAttempts = 100;
      for (let i = 0; i < maxAttempts; i++) {
        await new Promise(r => setTimeout(r, 2000));
        const status = await api.pollTaskStatus(pending.taskId);

        if (status.status_message && typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('chat-status', {
            detail: { message: status.status_message },
          }));
        }

        if (status.status === 'completed') {
          const widgets = [];
          if (status.message) {
            widgets.push({ type: 'paragraph', data: { text: status.message } });
          }
          if (status.widgets) {
            for (const w of status.widgets) widgets.push(w);
          }
          dispatch(addMessage({
            conversationId: currentConversationId,
            message: { role: 'assistant', widgets },
          }));
          break;
        }
        if (status.status === 'failed') {
          dispatch(addMessage({
            conversationId: currentConversationId,
            message: { role: 'assistant', widgets: [{ type: 'paragraph', data: { text: `Failed: ${status.error}` } }] },
          }));
          break;
        }
      }
    } catch (err) {
      dispatch(addMessage({
        conversationId: currentConversationId,
        message: { role: 'assistant', widgets: [{ type: 'paragraph', data: { text: `Permission handling failed: ${err.message}` } }] },
      }));
    } finally {
      dispatch(setLoading(false));
      pendingTaskRef.current = null;
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
      <div className="flex items-center justify-center app-shell bg-[#030712]">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col app-shell bg-[#030712] noise">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => dispatch(toggleLeftPanel())}
            className="md:hidden absolute top-3 left-3 z-30 p-2 glass rounded-lg text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <ChatArea onSendPrompt={(text) => handleSendMessage({ text, attachments: [] })} onPermissionChoice={handlePermissionChoice} />
          <ChatInput onSend={handleSendMessage} onSlashCommand={handleSlashCommand} />
        </div>
      </div>
    </div>
  );
}
