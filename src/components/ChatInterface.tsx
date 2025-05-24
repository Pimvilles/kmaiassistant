
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
  const { apiKey } = useVapi();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello, Mr Moloto! How can I assist you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      const response = await fetch('http://localhost:5678/webhook-test/f69ee3da-efaa-4274-a8cc-ea16b1b5f41d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          timestamp: new Date().toISOString(),
          sender: 'user'
        }),
      });
      
      if (response.ok) {
        console.log('Webhook response status:', response.status);
        
        // Get the response as text first
        const responseText = await response.text();
        console.log('Raw webhook response:', responseText);
        
        let responseContent = 'I received your message but could not generate a response.';
        
        // Try to parse as JSON first, if that fails, use as plain text
        try {
          const data = JSON.parse(responseText);
          console.log('Parsed JSON response:', data);
          
          // Extract response from various possible JSON structures
          if (data.response) {
            responseContent = data.response;
          } else if (data.message) {
            responseContent = data.message;
          } else if (data.reply) {
            responseContent = data.reply;
          } else if (data.text) {
            responseContent = data.text;
          } else if (typeof data === 'string') {
            responseContent = data;
          }
        } catch (jsonError) {
          // If JSON parsing fails, use the raw text as the response
          console.log('Response is not JSON, using as plain text:', responseText);
          if (responseText.trim()) {
            responseContent = responseText.trim();
          }
        }
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: responseContent,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error(`Webhook responded with status: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I am currently unable to respond. Please check if the webhook service is running and properly configured for CORS.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to webhook. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: 'Hello, Mr Moloto! How can I assist you today?',
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
