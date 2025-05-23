
import React, { useState } from 'react';

interface LogoContainerProps {
  imageSrc: string;
  className?: string;
}

const LogoContainer: React.FC<LogoContainerProps> = ({ imageSrc, className = "" }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  return (
    <div className={`logo-container animate-pulse-blue-glow rounded-full relative ${className}`}>
      {!imageLoaded && (
        <div className="w-full h-full flex items-center justify-center bg-white/50 rounded-full">
          <div className="text-blue-500">Loading...</div>
        </div>
      )}
      <img 
        src={imageSrc} 
        alt="Kwena AI Assistant" 
        className={`w-full h-full object-contain rounded-full ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        onLoad={handleImageLoad}
      />
      
      {/* Blue futuristic decorative elements */}
      <div className="absolute inset-0 border-2 border-blue-400/30 rounded-full -m-1"></div>
      <div className="absolute inset-0 border border-blue-300/20 rounded-full -m-2"></div>
      <div className="absolute inset-0 border border-blue-200/10 rounded-full -m-3"></div>
      
      {/* Blue tech circuit lines */}
      <div className="absolute top-0 left-1/2 h-8 w-px bg-gradient-to-b from-blue-400 to-transparent -translate-x-1/2 -translate-y-full opacity-60"></div>
      <div className="absolute bottom-0 left-1/2 h-8 w-px bg-gradient-to-t from-blue-400 to-transparent -translate-x-1/2 translate-y-full opacity-60"></div>
      <div className="absolute left-0 top-1/2 w-8 h-px bg-gradient-to-r from-blue-400 to-transparent -translate-y-1/2 -translate-x-full opacity-60"></div>
      <div className="absolute right-0 top-1/2 w-8 h-px bg-gradient-to-l from-blue-400 to-transparent -translate-y-1/2 translate-x-full opacity-60"></div>
    </div>
  );
};

export default LogoContainer;
