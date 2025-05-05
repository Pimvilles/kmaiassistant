
import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { webhookUrl, setWebhookUrl, isSettingsOpen, toggleSettings, closeSettings } = useSettings();
  const [tempUrl, setTempUrl] = useState(webhookUrl);
  const { toast } = useToast();
  
  const handleSave = () => {
    // Basic URL validation
    try {
      new URL(tempUrl);
      setWebhookUrl(tempUrl);
      toast({
        title: "Settings saved",
        description: "Your webhook URL has been updated",
      });
      closeSettings();
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeSettings();
    }
  };
  
  return (
    <>
      <button 
        className="settings-icon"
        onClick={toggleSettings}
        aria-label="Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
      
      <div 
        className={`settings-panel ${isSettingsOpen ? 'open' : ''}`}
        onKeyDown={handleKeyDown}
      >
        <div className="p-6 bg-gradient-to-b from-blue-50 to-white rounded-l-lg h-full">
          <h2 className="text-blue-600 text-2xl font-bold mb-6 flex items-center">
            <span className="mr-2">Settings</span>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          </h2>
          
          <div className="mb-6">
            <label className="block text-blue-700 text-sm font-bold mb-2" htmlFor="webhook-url">
              n8n Webhook URL
            </label>
            <input
              id="webhook-url"
              type="text"
              className="bg-white text-blue-800 border border-blue-200 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="https://your-n8n-webhook-url"
            />
            <p className="text-blue-500 text-xs mt-1">
              Enter the n8n webhook URL that will be triggered when "Call Agent K" is clicked
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button 
              className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-4 py-2 rounded-md hover:shadow-md transition-shadow duration-300 text-sm"
              onClick={handleSave}
            >
              Save Settings
            </button>
            
            <button 
              className="border border-blue-300 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors text-sm"
              onClick={closeSettings}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
