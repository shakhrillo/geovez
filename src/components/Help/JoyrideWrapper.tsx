import React, { useEffect } from 'react';
import Joyride from 'react-joyride';

// Custom wrapper for Joyride that ensures scrollparent compatibility
const JoyrideWrapper: React.FC<any> = (props) => {
  useEffect(() => {
    // Ensure scrollparent function exists before Joyride tries to use it
    if (typeof window !== 'undefined') {
      const getScrollParent = (element: Element | null): Element => {
        if (!element || element === document.documentElement) {
          return document.documentElement;
        }
        
        const parent = element.parentElement;
        if (!parent) {
          return document.documentElement;
        }
        
        const { overflow, overflowX, overflowY } = getComputedStyle(parent);
        if (/auto|scroll|hidden/.test(overflow + overflowX + overflowY)) {
          return parent;
        }
        
        return getScrollParent(parent);
      };

      // Set up multiple possible function names that joyride might look for
      // @ts-ignore
      if (!window.scrollParent) {
        // @ts-ignore
        window.scrollParent = getScrollParent;
      }
      
      // @ts-ignore
      if (!window.getScrollParent) {
        // @ts-ignore
        window.getScrollParent = getScrollParent;
      }
    }
  }, []);

  return <Joyride {...props} />;
};

export default JoyrideWrapper;
