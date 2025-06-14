
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the Vapi API key
const VAPI_API_KEY = "b0db1376-81d3-4b45-946a-7a79c57aa6d1";

interface VapiContextType {
  apiKey: string;
  showCallPage: boolean;
  setShowCallPage: (show: boolean) => void;
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
  
  return (
    <VapiContext.Provider 
      value={{ 
        apiKey: VAPI_API_KEY,
        showCallPage,
        setShowCallPage
      }}
    >
      {children}
    </VapiContext.Provider>
  );
};
