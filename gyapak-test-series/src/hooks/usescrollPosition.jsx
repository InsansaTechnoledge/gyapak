// components/layout/hooks/useScrollPosition.js ( this is for navbar )
import { useState, useEffect } from 'react';

const useScrollPosition = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return isScrolled;
};

export default useScrollPosition;