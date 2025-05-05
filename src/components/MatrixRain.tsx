
import React, { useEffect, useRef } from 'react';

const MatrixRain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
    const characterElements: HTMLElement[] = [];
    const columns = Math.floor(window.innerWidth / 15); // More columns by reducing width
    
    const createRainDrop = () => {
      const column = Math.floor(Math.random() * columns);
      const element = document.createElement('div');
      
      // Set random character
      element.innerHTML = characters.charAt(Math.floor(Math.random() * characters.length));
      element.className = 'matrix-character';
      
      // Make some characters brighter for effect
      if (Math.random() < 0.2) {
        element.classList.add('bright');
      }
      
      // Set position with slight randomness
      element.style.left = `${(column * 15) + (Math.random() * 5)}px`;
      
      // Set random animation duration - faster overall
      const duration = 3 + Math.random() * 7;
      element.style.animationDuration = `${duration}s`;
      
      // Add some transparency for a lighter effect
      element.style.opacity = (0.6 + Math.random() * 0.4).toString();
      
      // Append to container
      container.appendChild(element);
      characterElements.push(element);
      
      // Remove element after animation completes
      setTimeout(() => {
        if (element.parentNode === container) {
          container.removeChild(element);
        }
        const index = characterElements.indexOf(element);
        if (index > -1) {
          characterElements.splice(index, 1);
        }
      }, duration * 1000);
    };
    
    // Initial characters - more of them
    for (let i = 0; i < 150; i++) {
      setTimeout(createRainDrop, Math.random() * 2000);
    }
    
    // Continuous creation - more frequent
    const interval = setInterval(() => {
      createRainDrop();
    }, 80);
    
    // Handle resize
    const handleResize = () => {
      // Clear all existing characters
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      characterElements.length = 0;
      
      // Recalculate columns
      const newColumns = Math.floor(window.innerWidth / 15);
      
      // Create new characters
      for (let i = 0; i < 150; i++) {
        setTimeout(createRainDrop, Math.random() * 2000);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      characterElements.forEach(el => {
        if (el.parentNode === container) {
          container.removeChild(el);
        }
      });
    };
  }, []);
  
  return <div ref={containerRef} className="matrix-rain-container" />;
};

export default MatrixRain;
