
import React from 'react';
import MatrixRain from '../components/MatrixRain';
import LogoContainer from '../components/LogoContainer';
import CallButton from '../components/CallButton';
import Settings from '../components/Settings';

const Index = () => {
  // Using the uploaded image for the logo
  const logoUrl = '/lovable-uploads/76b42ff4-8327-424b-ae17-818df10c2c0d.png';
  
  return (
    <div className="h-screen w-screen overflow-hidden relative bg-gradient-to-b from-white to-blue-50">
      {/* Matrix Rain Background with more visibility */}
      <MatrixRain />
      
      {/* Main Content */}
      <main className="main-content flex flex-col items-center justify-center h-full">
        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2 text-gradient-blue">
            Kwena Boss A.I Assistant
          </h1>
        </div>
        
        <LogoContainer imageSrc={logoUrl} />
        <CallButton />
      </main>
      
      {/* Footer */}
      <footer className="footer">
        <p className="text-blue-600">Powered By: Kwena Moloto A.I Solutions</p>
      </footer>
      
      {/* Settings Panel */}
      <Settings />
    </div>
  );
};

export default Index;
