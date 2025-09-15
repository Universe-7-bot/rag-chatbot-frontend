import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { Message, ChatService } from './services/chatService';
import { generateSessionId, getStoredSessionId, storeSessionId } from './utils/session';
import './styles/App.scss';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    let currentSessionId = getStoredSessionId();
    
    if (!currentSessionId) {
      currentSessionId = generateSessionId();
      storeSessionId(currentSessionId);
    }
    
    setSessionId(currentSessionId);
    
    try {
      const history = await ChatService.getChatHistory(currentSessionId);
      setMessages(history);
    } catch (err) {
      console.error('Failed to load chat history:', err);
      setError('Failed to load chat history');
    }
  };

  // const handleSendMessage = async (content: string) => {
  //   if (!content.trim() || !sessionId || isLoading) return;

  //   const userMessage: Message = {
  //     id: Date.now().toString(),
  //     content,
  //     sender: 'user',
  //     timestamp: new Date()
  //   };

  //   setMessages(prev => [...prev, userMessage]);
  //   setIsLoading(true);
  //   setError(null);

  //   // Create initial bot message for streaming
  //   const botMessageId = (Date.now() + 1).toString();
  //   const initialBotMessage: Message = {
  //     id: botMessageId,
  //     content: '',
  //     sender: 'bot',
  //     timestamp: new Date(),
  //     isStreaming: true
  //   };

  //   setMessages(prev => [...prev, initialBotMessage]);

  //   try {
  //     await ChatService.sendMessageStreaming(
  //       sessionId,
  //       content,
  //       (chunk: string) => {
  //         setMessages(prev => prev.map(msg => 
  //           msg.id === botMessageId 
  //             ? { ...msg, content: msg.content + chunk }
  //             : msg
  //         ));
  //       },
  //       (sources?: any[]) => {
  //         // Complete the streaming message
  //         setMessages(prev => prev.map(msg => 
  //           msg.id === botMessageId 
  //             ? { ...msg, isStreaming: false, sources }
  //             : msg
  //         ));
  //       }
  //     );
  //   } catch (err) {
  //     console.error('Failed to send message:', err);
  //     setError('Failed to get response. Please try again.');
      
  //     // Remove the streaming message and add error message
  //     setMessages(prev => prev.filter(msg => msg.id !== botMessageId));
      
  //     const errorMessage: Message = {
  //       id: (Date.now() + 2).toString(),
  //       content: 'Sorry, I encountered an error processing your request. Please try again.',
  //       sender: 'bot',
  //       timestamp: new Date(),
  //       isError: true
  //     };

  //     setMessages(prev => [...prev, errorMessage]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !sessionId || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await ChatService.sendMessage(sessionId, content);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'bot',
        timestamp: new Date(),
        sources: response.sources
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to get response. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = async () => {
    if (!sessionId) return;

    try {
      await ChatService.clearSession(sessionId);
      setMessages([]);
      setError(null);
      
      // Generate new session
      const newSessionId = generateSessionId();
      storeSessionId(newSessionId);
      setSessionId(newSessionId);
    } catch (err) {
      console.error('Failed to reset chat:', err);
      setError('Failed to reset chat');
    }
  };

  return (
    <div className="app">
      <div className="app__container">
        <div className="app__header">
          <h1 className="app__title">News Chatbot</h1>
          <p className="app__subtitle">Ask me anything about recent news</p>
          <button 
            className="app__reset-btn"
            onClick={handleResetChat}
            disabled={isLoading}
          >
            Reset Chat
          </button>
        </div>
        
        <div className="app__content">
          <ChatWindow 
            messages={messages} 
            isLoading={isLoading}
            error={error}
          />
          <MessageInput 
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            placeholder="Ask me about recent news..."
          />
        </div>
      </div>
    </div>
  );
}

export default App;