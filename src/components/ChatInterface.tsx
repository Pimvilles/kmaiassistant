
import React, { useState, useRef, useEffect } from 'react';
import { useVapi } from '../contexts/VapiContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import CallButton from './CallButton';
import { Book, Mic, Menu, Send } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const { apiKey, sseUrl, setShowCallPage } = useVapi();
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
  const [isRecording, setIsRecording] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const eventSourceRef = useRef<EventSource | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Close all tracks of the stream
        stream.getTracks().forEach(track => track.stop());
        
        // For now, we'll just demonstrate by setting a message with the audio URL
        // In a real app, you'd send this to your backend for processing
        const userMessage: Message = {
          id: Date.now().toString(),
          content: `🎤 Voice message sent`,
          sender: 'user',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        
        toast({
          title: "Voice note recorded",
          description: "Voice note successfully recorded.",
        });
        
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const handleVoiceButton = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileType = file.type.split('/')[0];
      
      let fileIcon = '📄';
      if (fileType === 'image') fileIcon = '🖼️';
      if (fileType === 'audio') fileIcon = '🎵';
      if (fileType === 'video') fileIcon = '🎬';
      
      // For demo purposes, we'll just show a message that a file was attached
      // In a real app, you'd upload this file to your server
      const userMessage: Message = {
        id: Date.now().toString(),
        content: `${fileIcon} Attached: ${file.name}`,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      toast({
        title: "File attached",
        description: `${file.name} has been attached.`,
      });
      
      // Reset the input so the same file can be uploaded again if needed
      e.target.value = '';
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
      {/* Navigation Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="absolute top-4 left-4 p-2 hover:bg-gray-800 rounded-full">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-gray-900 text-white border-gray-700">
          <SheetHeader>
            <SheetTitle className="text-white">Menu</SheetTitle>
            <SheetDescription className="text-gray-400">
              Manage your chat settings
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={clearChat}
            >
              Clear Chat
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => {
                clearChat();
                toast({
                  title: "New chat started",
                  description: "You've started a new conversation.",
                });
              }}
            >
              New Chat
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                toast({
                  title: "Transcripts",
                  description: "This feature is coming soon.",
                });
              }}
            >
              Transcripts & History
            </Button>
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="dark-mode" className="text-white">Dark Mode</Label>
              <Switch 
                id="dark-mode" 
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Header */}
      <header className="flex justify-center items-center p-4 border-b border-gray-800">
        <div className="text-2xl font-bold text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Hello, KM A.I
          </span>
        </div>
        <div className="absolute right-4">
          <CallButton />
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
          <Button
            onClick={handleFileUpload}
            className="bg-gray-800 hover:bg-gray-700 text-white"
          >
            <Book className="h-5 w-5" />
            <span className="sr-only">Upload files</span>
          </Button>
          <input 
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            className="hidden"
            accept="image/*,audio/*,video/*,application/pdf,text/plain"
          />
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a prompt here"
            className="flex-1 bg-gray-800 border-gray-700 focus:border-blue-500 text-white resize-none"
            rows={1}
          />
          <Button
            onClick={handleVoiceButton}
            className={`${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-700'} text-white`}
            title={isRecording ? "Stop recording" : "Record voice message"}
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={isProcessing || !input.trim()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Send className="h-5 w-5" />
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
