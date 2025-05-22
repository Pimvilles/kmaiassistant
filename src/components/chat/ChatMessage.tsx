
import React from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div 
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-3/4 rounded-2xl px-4 py-2 ${
          message.sender === 'user' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-800 text-gray-100'
        }`}
      >
        {message.content}
        <div className={`text-xs mt-1 ${
          message.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
        }`}>
          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
