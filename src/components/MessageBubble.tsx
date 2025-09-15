import React from 'react';
import { Message } from '../services/chatService';
import { User, Bot, ExternalLink } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`message ${message.sender === 'user' ? 'message--user' : 'message--bot'} ${message.isError ? 'message--error' : ''} ${message.isStreaming ? 'message--streaming' : ''}`}>
      <div className="message__avatar">
        {message.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
      </div>
      
      <div className="message__content">
        <div className="message__bubble">
          <p className="message__text">
            {message.content}
            {message.isStreaming && <span className="message__cursor">|</span>}
          </p>
          
          {message.sources && message.sources.length > 0 && (
            <div className="message__sources">
              <h4>Sources:</h4>
              <ul>
                {message.sources.map((source, index) => (
                  <li key={index}>
                    <ExternalLink size={14} />
                    <span>{source.title}</span>
                    {source.url && (
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        Read more
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="message__timestamp">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;