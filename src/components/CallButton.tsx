
import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '@/hooks/use-toast';

const CallButton: React.FC = () => {
  const { webhookUrl } = useSettings();
  const { toast } = useToast();
  
  const handleCall = async () => {
    if (!webhookUrl) {
      toast({
        title: "No webhook URL configured",
        description: "Please set up your n8n webhook URL in settings",
        variant: "destructive"
      });
      return;
    }
    
    try {
      toast({
        title: "Calling Agent K",
        description: "Request sent to webhook...",
      });
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          action: 'call_agent',
        }),
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Agent K has been contacted",
        });
      } else {
        throw new Error(`HTTP error ${response.status}`);
      }
    } catch (error) {
      console.error('Error calling webhook:', error);
      toast({
        title: "Error",
        description: "Failed to contact Agent K. Check console for details.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <button 
      className="call-button mt-8"
      onClick={handleCall}
    >
      Call Agent K
    </button>
  );
};

export default CallButton;
