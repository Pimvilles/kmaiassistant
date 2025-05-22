
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface SideMenuProps {
  onClearChat: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ onClearChat }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  // Toggle dark mode
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <SheetContent side="left" className="bg-gray-900 text-white border-gray-700">
      <SheetHeader>
        <SheetTitle className="text-white">Menu</SheetTitle>
        <SheetDescription className="text-gray-400">
          Manage your chat settings
        </SheetDescription>
      </SheetHeader>
      <div className="mt-6 space-y-4">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={onClearChat}
        >
          Clear Chat
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => {
            onClearChat();
            toast({
              title: "New chat started",
              description: "You've started a new conversation.",
            });
          }}
        >
          New Chat
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => {
            toast({
              title: "Transcripts",
              description: "This feature is coming soon.",
            });
          }}
        >
          Transcripts & History
        </Button>
        <div className="flex items-center justify-between py-2">
          <Label htmlFor="dark-mode" className="text-white">Dark Mode</Label>
          <Switch 
            id="dark-mode" 
            checked={isDarkMode}
            onCheckedChange={setIsDarkMode}
          />
        </div>
      </div>
    </SheetContent>
  );
};

export default SideMenu;
