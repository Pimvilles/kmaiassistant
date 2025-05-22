
import React, { useEffect } from 'react';
import { useVapi } from '../contexts/VapiContext';
import ChatInterface from './ChatInterface';
import Index from '../pages/Index';

// Define Vapi on Window interface
declare global {
  interface Window {
    vapi: any;
  }
}

const MainLayout: React.FC = () => {
  const { showCallPage, endVoiceChat } = useVapi();
  
  // Handle escape key to exit voice chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCallPage) {
        endVoiceChat();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCallPage, endVoiceChat]);
  
  return (
    <div className="h-screen w-screen overflow-hidden">
      {showCallPage ? (
        <div className="relative">
          <Index />
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <button 
              onClick={endVoiceChat}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-3 flex items-center shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.59 10.52A7.66 7.66 0 0 1 16.93 15.79C14.77 19.97 9.24 21 9.24 21s1.03-5.53-3.15-7.69a7.65 7.65 0 0 1-3.19-4.11 7.66 7.66 0 0 1 1.44-7.62 7.67 7.67 0 0 1 6.8-2.82 7.65 7.65 0 0 1 5.36 3.25 7.66 7.66 0 0 1 1.4 7.66"/>
                <line x1="22" y1="2" x2="2" y2="22"/>
              </svg>
              End Call
            </button>
          </div>
        </div>
      ) : (
        <ChatInterface />
      )}
    </div>
  );
};

export default MainLayout;
