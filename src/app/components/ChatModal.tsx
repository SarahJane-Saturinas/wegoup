'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { supabase, useSupabaseWithAuth } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';

interface ChatMessage {
  sender: 'me' | 'them';
  text: string;
}

interface ChatContextType {
  openChat: (userId: string, userName: string) => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const supabaseAuth = useSupabaseWithAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [targetUserName, setTargetUserName] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const openChat = useCallback((userId: string, userName: string) => {
    setTargetUserId(userId);
    setTargetUserName(userName);
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setTargetUserId(null);
    setTargetUserName(null);
    setMessages([]);
    setInput('');
  }, []);

  // Load initial messages from Supabase
  useEffect(() => {
    if (!user || !targetUserId || !isOpen || !supabaseAuth) return;

    const loadMessages = async () => {
      const { data, error } = await supabaseAuth
        .from('message')
        .select('*')
        .or(`and(senderId.eq.${user.id},receiverId.eq.${targetUserId}),and(senderId.eq.${targetUserId},receiverId.eq.${user.id})`)
        .order('createdAt', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
      } else {
        const formattedMessages = data.map((msg: any) => ({
          sender: msg.senderId === user.id ? 'me' : 'them',
          text: msg.content,
        })) as ChatMessage[];
        setMessages(formattedMessages);
      }
    };
    loadMessages();
  }, [user, targetUserId, isOpen, supabaseAuth]);

  // Setup Supabase Realtime subscription for chat messages
  useEffect(() => {
    if (!user || !targetUserId || !isOpen || !supabaseAuth) return;

    const channel = supabaseAuth
      .channel('public:message')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message',
          filter: `or=(and(senderId.eq.${user.id},receiverId.eq.${targetUserId}),and(senderId.eq.${targetUserId},receiverId.eq.${user.id}))`,
        },
        (payload: any) => {
          setMessages((currentMessages) => [...currentMessages, { sender: payload.new.senderId === user.id ? 'me' : 'them', text: payload.new.content }]);
        }
      )
      .subscribe((status: string, err: any) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log('Subscription status:', status);
        }
      });

    return () => {
      supabaseAuth.removeChannel(channel);
    };
  }, [user, targetUserId, isOpen, supabaseAuth]);

  const sendMessageHandler = async () => {
    if (!input.trim() || !user || !targetUserId || !supabaseAuth) return;

    const messageContent = input.trim();
    setInput('');

    try {
      const { error } = await supabaseAuth.from('message').insert({
        senderId: user.id,
        receiverId: targetUserId,
        content: messageContent,
      });

      if (error) {
        console.error('Error sending message:', error);
      }
    } catch (err) {
      console.error('Unexpected error sending message:', err);
    }
  };

  return (
    <ChatContext.Provider value={{ openChat, closeChat }}>
      {children}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-96 bg-white border border-gray-300 rounded-xl shadow-lg flex flex-col overflow-hidden z-50">
          <div className="bg-green-600 text-white px-4 py-2 font-semibold cursor-pointer rounded-t-xl flex justify-between items-center">
            <span>Chat with {targetUserName}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label="Minimize chat"
                className="hover:bg-green-700 rounded px-2 py-1"
              >
                &#8211;
              </button>
              <button
                onClick={closeChat}
                aria-label="Close chat"
                className="hover:bg-green-700 rounded px-2 py-1"
              >
                &#10005;
              </button>
            </div>
          </div>
          {!isMinimized && (
            <div className="flex flex-col flex-1 overflow-hidden h-[400px] rounded-bl-xl rounded-br-xl">
              <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`max-w-xs px-4 py-2 rounded ${
                      msg.sender === 'me' ? 'bg-green-600 text-white self-end' : 'bg-gray-200 self-start'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 p-2 border-t rounded-bl-xl rounded-br-xl">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      sendMessageHandler();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 border rounded px-4 py-2"
                />
                <button
                  onClick={sendMessageHandler}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </ChatContext.Provider>
  );
};
