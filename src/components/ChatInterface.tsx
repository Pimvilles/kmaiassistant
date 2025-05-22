
import React, { useState, useRef, useEffect } from 'react';
import { useVapi } from '../contexts/VapiContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import CallButton from './CallButton';
import { Phone, Mic, MicOff, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  actionResult?: {
    action: string;
    result: string;
  };
}

const ChatInterface: React.FC = () => {
  const { apiKey, sseUrl, setShowCallPage, startVoiceChat, isVoiceChatActive, voiceTranscript } = useVapi();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello, I am KM A.I. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const eventSourceRef = useRef<EventSource | null>(null);
  const [interaction, setInteraction] = useState<'text' | 'voice'>('text');
  
  // Add voice transcript to messages when updated
  useEffect(() => {
    if (voiceTranscript && interaction === 'voice') {
      // Look for a user message with "voice transcript" tag
      const existingTranscriptIndex = messages.findIndex(
        msg => msg.sender === 'user' && msg.id.includes('voice-transcript')
      );
      
      if (existingTranscriptIndex >= 0) {
        // Update existing transcript message
        const updatedMessages = [...messages];
        updatedMessages[existingTranscriptIndex] = {
          ...updatedMessages[existingTranscriptIndex],
          content: voiceTranscript
        };
        setMessages(updatedMessages);
      } else {
        // Add new transcript message
        const transcriptMessage: Message = {
          id: `voice-transcript-${Date.now()}`,
          content: voiceTranscript,
          sender: 'user',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, transcriptMessage]);
      }
    }
  }, [voiceTranscript, interaction]);
  
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
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      // Connect to the provided SSE URL with the message
      const encodedMessage = encodeURIComponent(input.trim());
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
          console.log("SSE data received:", data);
          
          if (data.message) {
            const aiResponse: Message = {
              id: (Date.now() + 1).toString(),
              content: data.message,
              sender: 'ai',
              timestamp: new Date(),
              // Add action result if available
              actionResult: data.action ? {
                action: data.action.name || "Action",
                result: data.action.result || "Completed"
              } : undefined
            };
            
            setMessages(prev => [...prev, aiResponse]);
            setIsProcessing(false);
            eventSource.close();
            eventSourceRef.current = null;
            
            // Log the interaction
            logInteraction("text_chat", {
              user_message: input.trim(),
              ai_response: data.message
            });
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
  
  // Log user interactions
  const logInteraction = (type: string, data: any) => {
    console.log(`[LOG] ${type}:`, data);
    // In a real implementation, you might send this to a logging service
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleVoiceChat = () => {
    setInteraction('voice');
    startVoiceChat(); 
    
    // Log the voice chat start
    logInteraction("voice_chat_start", {
      timestamp: new Date().toISOString()
    });
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="text-2xl font-bold">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Hello, KM A.I
          </span>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setInteraction('text')}
            className={`${interaction === 'text' ? 'bg-blue-600' : 'bg-gray-800'}`}
            title="Text Chat"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleVoiceChat}
            className={`${interaction === 'voice' ? 'bg-blue-600' : 'bg-gray-800'}`}
            title="Voice Chat"
          >
            {isVoiceChatActive ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        </div>
      </header>
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
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
              {message.actionResult && (
                <div className="mt-2 p-2 bg-gray-700 rounded-md text-sm">
                  <p className="font-semibold">{message.actionResult.action}</p>
                  <p>{message.actionResult.result}</p>
                </div>
              )}
              <div className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
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
      
      {/* Input Area */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a prompt here"
            className="flex-1 bg-gray-800 border-gray-700 focus:border-blue-500 text-white resize-none"
            rows={1}
            disabled={interaction === 'voice'}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isProcessing || !input.trim() || interaction === 'voice'}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="p-2 text-center border-t border-gray-800">
        <p className="text-blue-600 text-sm">Powered By: Kwena Moloto A.I Solutions</p>
      </footer>
    </div>
  );
};

export default ChatInterface;
