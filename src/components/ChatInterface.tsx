
import React, { useState, useRef, useEffect } from 'react';
import { useVapi } from '../contexts/VapiContext';
import { useToast } from '@/hooks/use-toast';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';
import ChatHeader from './chat/ChatHeader';
import ChatFooter from './chat/ChatFooter';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const { apiKey, sseUrl } = useVapi();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello, I am KM A.I. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const eventSourceRef = useRef<EventSource | null>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Clean up EventSource on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleSendMessage = async (messageContent: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    try {
      // Connect to the provided SSE URL with the message
      const encodedMessage = encodeURIComponent(messageContent);
      const url = `${sseUrl}?message=${encodedMessage}`;
      
      // Close any existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      
      // Create new SSE connection
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.message) {
            const aiResponse: Message = {
              id: (Date.now() + 1).toString(),
              content: data.message,
              sender: 'ai',
              timestamp: new Date()
            };
            
            setMessages(prev => [...prev, aiResponse]);
            setIsProcessing(false);
            eventSource.close();
            eventSourceRef.current = null;
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };
      
      eventSource.onerror = () => {
        // Handle error
        toast({
          title: "Error",
          description: "Failed to connect to chatbot. Please try again.",
          variant: "destructive"
        });
        setIsProcessing(false);
        eventSource.close();
        eventSourceRef.current = null;
      };
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: 'Hello, I am KM A.I. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date()
    }]);
    toast({
      title: "Chat cleared",
      description: "All messages have been cleared.",
    });
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <ChatHeader onClearChat={clearChat} />
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 rounded-2xl px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
      />
      
      <ChatFooter />
    </div>
  );
};

export default ChatInterface;
