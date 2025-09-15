import React, { useEffect, useRef } from 'react';
import { Message } from '../services/chatService';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';
import { AlertCircle } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, error }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="chat-window" ref={scrollRef}>
      <div className="chat-window__content">
        {messages.length === 0 && !isLoading && (
          <div className="chat-window__welcome">
            <h3>Welcome to News Chatbot!</h3>
            <p>I can help you with information about recent news. Ask me anything!</p>
          </div>
        )}
        
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isLoading && <LoadingIndicator />}
        
        {error && (
          <div className="chat-window__error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;