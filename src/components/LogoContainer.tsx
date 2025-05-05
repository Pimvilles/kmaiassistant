
import React, { useState } from 'react';

interface LogoContainerProps {
  imageSrc: string;
}

const LogoContainer: React.FC<LogoContainerProps> = ({ imageSrc }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  return (
    <div className="logo-container w-64 h-64 md:w-80 md:h-80 animate-pulse-glow">
      {!imageLoaded && (
        <div className="w-full h-full flex items-center justify-center bg-matrix-bg">
          <div className="text-matrix-light">Loading...</div>
        </div>
      )}
      <img 
        src={imageSrc} 
        alt="Kwena AI Assistant" 
        className={`w-full h-full object-cover ${imageLoaded ? 'block' : 'hidden'}`}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default LogoContainer;
