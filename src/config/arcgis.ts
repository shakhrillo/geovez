import config from '@arcgis/core/config';

// ArcGIS API Configuration
export const initializeArcGISConfig = () => {
  // Set the ArcGIS API for JavaScript assets path
  // This is automatically handled when using @arcgis/core from npm
  
  // Optional: Configure portal URL if using a custom portal
  // config.portalUrl = "https://your-portal.com/portal";
  
  // Optional: Configure API key for accessing ArcGIS services
  // config.apiKey = "your-api-key-here";
  
  // Configure for production build optimization
  config.workers.loaderConfig = {
    has: {
      "esri-featurelayer-webgl": 1
    }
  };
};

// Default map configurations
export const defaultMapConfig = {
  // Melbourne, Australia coordinates
  center: [144.9631, -37.8136] as [number, number],
  zoom: 10,
  // Using a well-known public Esri sample web map that doesn't require authentication
  defaultWebMapId: '6086cafaea434dfa8e8b9c96c4659395' // Esri public sample map
};

// Widget configurations
export const widgetConfig = {
  layerList: {
    listItemCreatedFunction: (event: any) => {
      const item = event.item;
      if (item.layer.type !== "group") {
        item.panel = {
          content: "legend",
          open: false
        };
      }
    }
  },
  legend: {
    style: "classic" as const
  }
};
