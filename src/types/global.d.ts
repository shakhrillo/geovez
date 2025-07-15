// Global type definitions for ArcGIS API and window extensions
declare global {
  interface Window {
    esri: any;
    scrollParent?: (element: Element) => Element;
  }
}

export {};
