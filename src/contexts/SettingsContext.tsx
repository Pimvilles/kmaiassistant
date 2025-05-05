
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
  closeSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  
  useEffect(() => {
    // Load webhook URL from localStorage on mount
    const savedUrl = localStorage.getItem('kwena_webhook_url');
    if (savedUrl) {
      setWebhookUrl(savedUrl);
    }
  }, []);
  
  const saveWebhookUrl = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem('kwena_webhook_url', url);
  };
  
  const toggleSettings = () => {
    setIsSettingsOpen(prev => !prev);
  };
  
  const closeSettings = () => {
    setIsSettingsOpen(false);
  };
  
  return (
    <SettingsContext.Provider 
      value={{ 
        webhookUrl, 
        setWebhookUrl: saveWebhookUrl,
        isSettingsOpen,
        toggleSettings,
        closeSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
