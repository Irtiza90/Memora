import { useState, useEffect, useRef } from 'react';

const TypingAnimation = ({ text, speed = 2, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const timerRef = useRef(null);
  const chunkSize = 5; // Process multiple characters at once for better performance

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    if (timerRef.current) clearTimeout(timerRef.current);
    
    if (!text) {
      onComplete && onComplete();
      return;
    }
    
    let currentIndex = 0;
    
    const animateText = () => {
      if (currentIndex >= text.length) {
        onComplete && onComplete();
        return;
      }
      
      // Process multiple characters at once for better performance
      const nextChunk = Math.min(currentIndex + chunkSize, text.length);
      const newText = text.substring(0, nextChunk);
      setDisplayedText(newText);
      currentIndex = nextChunk;
      
      timerRef.current = setTimeout(animateText, speed);
    };
    
    animateText();
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, speed, onComplete]);

  // If no text provided, return empty span
  if (!text) return <span></span>;
  
  return <span>{displayedText}</span>;
};

export default TypingAnimation; 
