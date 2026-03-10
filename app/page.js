'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import RightPanel from '@/components/layout/RightPanel';
import ChatArea from '@/components/chat/ChatArea';
import ChatInput from '@/components/chat/ChatInput';
import { createConversation, addMessage, setLoading } from '@/store/slices/chatSlice';

export default function Home() {
  const dispatch = useDispatch();
  const { currentConversationId, conversations } = useSelector((state) => state.chat);

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

    // Add user message
    dispatch(addMessage({
      conversationId: currentConversationId,
      message: {
        role: 'user',
        text: messageData.text,
        attachments: messageData.attachments,
      },
    }));

    // Simulate bot response with widgets
    dispatch(setLoading(true));

    // Simulate API call delay
    setTimeout(() => {
      // Example response with multiple widgets
      const botResponse = generateBotResponse(messageData.text);

      dispatch(addMessage({
        conversationId: currentConversationId,
        message: {
          role: 'assistant',
          widgets: botResponse,
        },
      }));

      dispatch(setLoading(false));
    }, 1500);
  };

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

// Helper function to generate sample bot responses
function generateBotResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('table') || lowerMessage.includes('data')) {
    return [
      {
        type: 'paragraph',
        data: {
          text: 'Here is the data you requested in table format:',
          timestamp: new Date().toISOString(),
        },
      },
      {
        type: 'table',
        data: {
          title: 'Sales Report',
          columns: ['Product', 'Q1', 'Q2', 'Q3', 'Q4'],
          rows: [
            ['Product A', '$12,000', '$15,000', '$18,000', '$20,000'],
            ['Product B', '$8,000', '$9,500', '$11,000', '$13,500'],
            ['Product C', '$5,000', '$6,200', '$7,500', '$9,000'],
          ],
          timestamp: new Date().toISOString(),
        },
      },
    ];
  }

  if (lowerMessage.includes('list') || lowerMessage.includes('bullet')) {
    return [
      {
        type: 'bullets',
        data: {
          title: 'Key Points',
          items: [
            'First important point about your query',
            'Second key insight based on the analysis',
            'Third consideration to keep in mind',
            'Fourth recommendation for next steps',
          ],
          ordered: false,
          timestamp: new Date().toISOString(),
        },
      },
    ];
  }

  if (lowerMessage.includes('form')) {
    return [
      {
        type: 'paragraph',
        data: {
          text: 'Please fill out this form:',
          timestamp: new Date().toISOString(),
        },
      },
      {
        type: 'form',
        data: {
          title: 'Contact Form',
          fields: [
            {
              name: 'name',
              label: 'Full Name',
              type: 'text',
              placeholder: 'Enter your name',
              required: true,
            },
            {
              name: 'email',
              label: 'Email Address',
              type: 'email',
              placeholder: 'your.email@example.com',
              required: true,
            },
            {
              name: 'category',
              label: 'Category',
              type: 'select',
              options: [
                { label: 'General Inquiry', value: 'general' },
                { label: 'Support', value: 'support' },
                { label: 'Feedback', value: 'feedback' },
              ],
              required: true,
            },
            {
              name: 'message',
              label: 'Message',
              type: 'textarea',
              placeholder: 'Type your message here...',
              required: true,
            },
          ],
          submitLabel: 'Submit',
          timestamp: new Date().toISOString(),
        },
      },
    ];
  }

  if (lowerMessage.includes('image')) {
    return [
      {
        type: 'paragraph',
        data: {
          text: 'Here is an example image:',
          timestamp: new Date().toISOString(),
        },
      },
      {
        type: 'image',
        data: {
          url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
          alt: 'Sample Image',
          caption: 'A beautiful sample image from Unsplash',
          timestamp: new Date().toISOString(),
        },
      },
    ];
  }

  if (lowerMessage.includes('template') || lowerMessage.includes('email builder')) {
    return [
      {
        type: 'paragraph',
        data: {
          text: 'I\'ve opened the Email Template Builder for you! You can drag and drop components to create your custom email template.',
          timestamp: new Date().toISOString(),
        },
      },
      {
        type: 'template-builder',
        data: {
          title: 'Email Template Builder',
          description: 'Create beautiful email templates with drag-and-drop interface',
          timestamp: new Date().toISOString(),
        },
      },
    ];
  }

  // Default response
  return [
    {
      type: 'paragraph',
      data: {
        text: `I received your message: "${userMessage}"\n\nTry asking me about:\n• Tables or data\n• Lists or bullets\n• Forms\n• Images\n• Template or Email Builder\n\nI'll respond with the appropriate widget!`,
        timestamp: new Date().toISOString(),
      },
    },
  ];
}
