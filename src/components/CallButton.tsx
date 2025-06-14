
import React from 'react';
import { useVapi } from '../contexts/VapiContext';
import { useToast } from '@/hooks/use-toast';

const CallButton: React.FC = () => {
  const { apiKey, setShowCallPage } = useVapi();
  const { toast } = useToast();
  
  const handleCall = async () => {
    try {
      toast({
        title: "Calling Agent K",
        description: "Initiating voice call..."
      });
      
      // In a real implementation, this is where you would call the Vapi API
      // For now, we'll just show a success message
      
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
    <button 
      onClick={handleCall} 
      className="call-button relative group mt-8 px-8 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full font-semibold shadow-lg shadow-blue-300/30 hover:shadow-blue-400/40 transition-all duration-300 overflow-hidden z-10"
    >
      {/* Futuristic effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-300 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
      <span className="relative z-10 flex items-center justify-center">
        <span className="mr-2">Call Agent K</span>
        <span className="w-2 h-2 bg-blue-200 rounded-full animate-ping"></span>
      </span>
    </button>
  );
};

export default CallButton;
