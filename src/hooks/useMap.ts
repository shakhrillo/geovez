import { useEffect, useRef, useState } from 'react';
import MapView from '@arcgis/core/views/MapView';
// import WebMap from '@arcgis/core/WebMap'; // TODO: Re-enable when authentication is implemented
import Map from '@arcgis/core/Map';
import LayerList from '@arcgis/core/widgets/LayerList';
import Legend from '@arcgis/core/widgets/Legend';
import Expand from '@arcgis/core/widgets/Expand';
import { initializeArcGISConfig, widgetConfig } from '../config/arcgis';

interface UseMapOptions {
  webMapId: string;
  center: [number, number];
  zoom: number;
}

export const useMap = ({ webMapId, center, zoom }: UseMapOptions) => {
  // TODO: webMapId will be used once authentication is implemented
  console.log('useMap initialized with webMapId:', webMapId);
  const viewRef = useRef<MapView | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  const initializeMap = async () => {
    if (!mapRef.current || mapInitialized) {
      console.log('Map initialization skipped:', { 
        hasContainer: !!mapRef.current, 
        mapInitialized 
      });
      return;
    }

    try {
      console.log('Starting map initialization...');
      setIsLoading(true);
      setError(null);

      // Initialize ArcGIS configuration
      initializeArcGISConfig();
      console.log('ArcGIS config initialized');

      // Clean up previous view if it exists
      if (viewRef.current) {
        try {
          viewRef.current.destroy();
          viewRef.current = null;
        } catch (cleanupError) {
          console.warn('Error cleaning up previous map view:', cleanupError);
        }
      }

      let map;
      
      // For now, just use a basic map until authentication is properly set up
      // Once authentication is working, we can try to load web maps
      console.log('Creating basic map with basemap...');
      map = new Map({
        basemap: 'streets-navigation-vector'
      });
      
      // TODO: Once authentication is implemented, try to load WebMap
      // try {
      //   // Try to create a WebMap first
      //   const webmap = new WebMap({
      //     portalItem: {
      //       id: webMapId
      //     }
      //   });
      //   await webmap.load();
      //   map = webmap;
      //   console.log('Successfully loaded WebMap:', webMapId);
      // } catch (webMapError) {
      //   console.warn('Failed to load WebMap, falling back to basic map:', webMapError);
      //   map = new Map({
      //     basemap: 'streets-navigation-vector'
      //   });
      // }

      // Create the MapView
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: center,
        zoom: zoom
      });

      // Store view reference
      viewRef.current = view;
      console.log('MapView created');

      // Wait for view to be ready
      await view.when();
      console.log('MapView ready');

      // Add widgets
      const layerList = new LayerList({
        view: view,
        ...widgetConfig.layerList
      });

      const legend = new Legend({
        view: view,
        style: widgetConfig.legend.style
      });

      const layerListExpand = new Expand({
        view: view,
        content: layerList,
        expandIcon: 'layers',
        group: 'top-right',
        expandTooltip: 'Show/Hide Layers'
      });

      const legendExpand = new Expand({
        view: view,
        content: legend,
        expandIcon: 'legend',
        group: 'top-right',
        expandTooltip: 'Show/Hide Legend'
      });

      view.ui.add([layerListExpand, legendExpand], 'top-right');

      console.log('Map initialization complete');
      setIsLoading(false);
      setMapInitialized(true);
    } catch (error) {
      console.error('Failed to initialize map:', error);
      setError(error instanceof Error ? error.message : 'Failed to load map');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (viewRef.current) {
        try {
          viewRef.current.destroy();
          viewRef.current = null;
        } catch (error) {
          console.warn('Error destroying map view:', error);
        }
      }
    };
  }, []);

  return {
    view: viewRef.current,
    isLoading,
    error,
    mapRef,
    initializeMap,
    retry: () => {
      setError(null);
      setMapInitialized(false);
      initializeMap();
    }
  };
};
