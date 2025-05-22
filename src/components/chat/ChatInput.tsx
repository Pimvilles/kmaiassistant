
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Book, Mic, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isProcessing }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Close all tracks of the stream
        stream.getTracks().forEach(track => track.stop());
        
        // In a real app, you'd send this to your backend for processing
        onSendMessage(`🎤 Voice message sent`);
        
        toast({
          title: "Voice note recorded",
          description: "Voice note successfully recorded.",
        });
        
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const handleVoiceButton = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileType = file.type.split('/')[0];
      
      let fileIcon = '📄';
      if (fileType === 'image') fileIcon = '🖼️';
      if (fileType === 'audio') fileIcon = '🎵';
      if (fileType === 'video') fileIcon = '🎬';
      
      onSendMessage(`${fileIcon} Attached: ${file.name}`);
      
      toast({
        title: "File attached",
        description: `${file.name} has been attached.`,
      });
      
      // Reset the input so the same file can be uploaded again if needed
      e.target.value = '';
    }
  };

  return (
    <div className="border-t border-gray-800 p-4">
      <div className="flex space-x-2">
        <Button
          onClick={handleFileUpload}
          className="bg-gray-800 hover:bg-gray-700 text-white"
        >
          <Book className="h-5 w-5" />
          <span className="sr-only">Upload files</span>
        </Button>
        <input 
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          className="hidden"
          accept="image/*,audio/*,video/*,application/pdf,text/plain"
        />
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a prompt here"
          className="flex-1 bg-gray-800 border-gray-700 focus:border-blue-500 text-white resize-none"
          rows={1}
        />
        <Button
          onClick={handleVoiceButton}
          className={`${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-700'} text-white`}
          title={isRecording ? "Stop recording" : "Record voice message"}
        >
          <Mic className="h-5 w-5" />
        </Button>
        <Button
          onClick={handleSend}
          disabled={isProcessing || !input.trim()}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
