
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the Vapi API key
const VAPI_API_KEY = "b0db1376-81d3-4b45-946a-7a79c57aa6d1";
const CHATBOT_SSE_URL = "https://mcp.zapier.com/api/mcp/s/MDBmNjI4M2YtOTJhNy00Yjg4LWEzMTUtYWEzZjg2YmQ3MDUyOjYzNGFjYWE2LTQ0MDctNDNkMi1hNjI0LWRiOGUzZDNjZWFmNQ==/sse";

interface VapiContextType {
  apiKey: string;
  sseUrl: string;
  showCallPage: boolean;
  setShowCallPage: (show: boolean) => void;
  startVoiceChat: () => void;
  endVoiceChat: () => void;
  isVoiceChatActive: boolean;
  voiceTranscript: string;
}

const VapiContext = createContext<VapiContextType | undefined>(undefined);

export const useVapi = (): VapiContextType => {
  const context = useContext(VapiContext);
  if (!context) {
    throw new Error('useVapi must be used within a VapiProvider');
  }
  return context;
};

interface VapiProviderProps {
  children: ReactNode;
}

export const VapiProvider: React.FC<VapiProviderProps> = ({ children }) => {
  const [showCallPage, setShowCallPage] = useState<boolean>(false);
  const [isVoiceChatActive, setIsVoiceChatActive] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  
  // Load Vapi SDK script
  useEffect(() => {
    const loadVapiSDK = async () => {
      try {
        // Check if script is already loaded
        if (!document.getElementById('vapi-sdk')) {
          const script = document.createElement('script');
          script.id = 'vapi-sdk';
          script.src = 'https://cdn.vapi.ai/web-sdk.js';
          script.async = true;
          script.onload = () => {
            console.log('Vapi SDK loaded successfully');
          };
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error('Error loading Vapi SDK:', error);
      }
    };

    loadVapiSDK();
  }, []);

  // Start voice chat session
  const startVoiceChat = () => {
    setShowCallPage(true);
    setIsVoiceChatActive(true);
    
    // Initialize Vapi if window.vapi exists
    if (typeof window !== 'undefined' && window.vapi) {
      try {
        window.vapi.init({ 
          apiKey: VAPI_API_KEY, 
          options: {
            // Configure Vapi options
            transcriptStreaming: true,
            autoStart: true,
          }
        });

        // Handle transcript updates
        window.vapi.onTranscript((transcript) => {
          setVoiceTranscript(transcript);
          console.log('Transcript:', transcript);
        });

        // Start the conversation
        window.vapi.start();

      } catch (error) {
        console.error('Error initializing Vapi:', error);
      }
    } else {
      console.error('Vapi SDK not loaded or not available');
    }
  };

  // End voice chat session
  const endVoiceChat = () => {
    if (typeof window !== 'undefined' && window.vapi) {
      try {
        window.vapi.stop();
      } catch (error) {
        console.error('Error stopping Vapi:', error);
      }
    }
    setShowCallPage(false);
    setIsVoiceChatActive(false);
    setVoiceTranscript('');
  };
  
  return (
    <VapiContext.Provider 
      value={{ 
        apiKey: VAPI_API_KEY,
        sseUrl: CHATBOT_SSE_URL,
        showCallPage,
        setShowCallPage,
        startVoiceChat,
        endVoiceChat,
        isVoiceChatActive,
        voiceTranscript
      }}
    >
      {children}
    </VapiContext.Provider>
  );
};
