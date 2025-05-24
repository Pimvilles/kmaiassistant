
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
      content: 'Yebo Mr Moloto! Jarvus here, ready to assist you today, Boss! What can I help you with?',
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
      const response = await fetch('https://mcp.zapier.com/api/mcp/s/MDBmNjI4M2YtOTJhNy00Yjg4LWEzMTUtYWEzZjg2YmQ3MDUyOjMxNThmZmQ3LWZlY2EtNGE5YS04MjkzLWU0N2YzOTQ5ZGZkYQ==/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          timestamp: new Date().toISOString(),
          sender: 'user',
          context: {
            identity: 'Jarvus',
            user: 'Mr Moloto',
            personality: 'South African digital assistant with township flair',
            date: new Date().toLocaleDateString('en-ZA', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })
          }
        }),
      });
      
      if (response.ok) {
        console.log('MCP response status:', response.status);
        
        // Get the response as text first
        const responseText = await response.text();
        console.log('Raw MCP response:', responseText);
        
        let responseContent = 'Eish, Boss! I received your message but couldn\'t generate a proper response right now.';
        
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
          } else if (data.content) {
            responseContent = data.content;
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
        throw new Error(`MCP endpoint responded with status: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Error sending message to MCP:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Yho, Mr Moloto! Something went wrong on my side. The connection to my brain isn\'t working properly right now. Let me try to sort this out, Boss!',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to MCP endpoint. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: 'Yebo Mr Moloto! Jarvus here, ready to assist you today, Boss! What can I help you with?',
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
