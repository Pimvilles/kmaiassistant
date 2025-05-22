
import React from 'react';
import { useVapi } from '../contexts/VapiContext';
import ChatInterface from './ChatInterface';
import Index from '../pages/Index';

const MainLayout: React.FC = () => {
  const { showCallPage } = useVapi();
  
  return (
    <div className="h-screen w-screen overflow-hidden">
      {showCallPage ? <Index /> : <ChatInterface />}
    </div>
  );
};

export default MainLayout;
