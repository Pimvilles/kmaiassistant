
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import LogoContainer from './LogoContainer';

declare global {
  interface Window {
    vapiInstance: any;
  }
}

const CallButton: React.FC = () => {
  const { toast } = useToast();
  
  // Using the uploaded image for the logo
  const logoUrl = '/lovable-uploads/76b42ff4-8327-424b-ae17-818df10c2c0d.png';
  
  const handleCall = async () => {
    try {
      // Check if vapiInstance is available
      if (!window.vapiInstance) {
        toast({
          title: "Error",
          description: "Voice agent not initialized. Please refresh the page and try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Calling Agent K",
        description: "Initiating voice call..."
      });
      
      // Use the vapiInstance to start the call
      await window.vapiInstance.start();
      
      toast({
        title: "Success",
        description: "Agent K call initiated successfully"
      });
      
    } catch (error) {
      console.error('Error calling Vapi:', error);
      toast({
        title: "Error",
        description: "Failed to contact Agent K. Please try again.",
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
