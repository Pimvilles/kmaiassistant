
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
} from "@/components/ui/sheet";
import CallButton from '../CallButton';
import SideMenu from './SideMenu';

interface ChatHeaderProps {
  onClearChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClearChat }) => {
  return (
    <header className="flex justify-center items-center p-4 border-b border-gray-800">
      {/* Navigation Menu Trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="absolute top-4 left-4 p-2 hover:bg-gray-800 rounded-full">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SideMenu onClearChat={onClearChat} />
      </Sheet>
      
      {/* Header Title */}
      <div className="text-2xl font-bold text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
          Hello, Mr Moloto
        </span>
      </div>
      
      {/* Call Button */}
      <div className="absolute right-4">
        <CallButton />
      </div>
    </header>
  );
};

export default ChatHeader;
