// Shim for scrollparent module to work with react-joyride
// This file needs to be imported before any components that use react-joyride

// Import the actual scrollparent module
import scrollparent from 'scrollparent';

// Ensure that scrollparent works as expected by react-joyride
if (typeof scrollparent === 'function') {
  // Add default export if it doesn't exist (for ES module compatibility)
  if (!(scrollparent as any).default) {
    (scrollparent as any).default = scrollparent;
  }
  
  // Also ensure it's available globally if needed
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.scrollParent = scrollparent;
  }
}

// Export the fixed module
export default scrollparent;
