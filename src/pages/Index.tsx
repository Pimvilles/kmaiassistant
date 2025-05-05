
import React from 'react';
import MatrixRain from '../components/MatrixRain';
import LogoContainer from '../components/LogoContainer';
import CallButton from '../components/CallButton';
import Settings from '../components/Settings';

const Index = () => {
  // The sample logo URL, which will be replaced by the user's custom logo
  const logoUrl = '/lovable-uploads/042ee897-d450-4c1d-bb04-ed63826332b6.png';

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Matrix Rain Background */}
      <MatrixRain />
      
      {/* Header */}
      <header className="header">
        <h1 className="text-xl font-bold">Kwena Boss A.I Assistant</h1>
      </header>
      
      {/* Main Content */}
      <main className="main-content">
        <LogoContainer imageSrc={logoUrl} />
        <CallButton />
      </main>
      
      {/* Footer */}
      <footer className="footer">
        <p>Powered By: Kwena Moloto A.I Solutions</p>
      </footer>
      
      {/* Settings Panel */}
      <Settings />
    </div>
  );
};

export default Index;
