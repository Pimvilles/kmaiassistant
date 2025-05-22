
import React from 'react';
import { useVapi } from '../contexts/VapiContext';
import { useToast } from '@/hooks/use-toast';
import LogoContainer from './LogoContainer';

const CallButton: React.FC = () => {
  const { apiKey, setShowCallPage } = useVapi();
  const { toast } = useToast();
  
  // Using the uploaded image for the logo
  const logoUrl = '/lovable-uploads/76b42ff4-8327-424b-ae17-818df10c2c0d.png';
  
  const handleCall = async () => {
    try {
      toast({
        title: "Calling Agent K",
        description: "Initiating voice call..."
      });
      
      // Implement actual Vapi API call
      const response = await fetch('https://api.vapi.ai/call/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          agent_id: 'agent_k',
          // Add any additional parameters required by the Vapi API
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect to Agent K');
      }
      
      toast({
        title: "Success",
        description: "Agent K has been contacted"
      });
      
      // Go back to chat interface
      setTimeout(() => {
        setShowCallPage(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error calling Vapi API:', error);
      toast({
        title: "Error",
        description: "Failed to contact Agent K. Check console for details.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div 
      onClick={handleCall} 
      className="cursor-pointer hover:scale-105 transition-transform duration-300"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20">
        <LogoContainer imageSrc={logoUrl} />
      </div>
    </div>
  );
};

export default CallButton;
