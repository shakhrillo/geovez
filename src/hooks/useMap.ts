import { useEffect, useRef, useState } from 'react';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import Map from '@arcgis/core/Map';
import LayerList from '@arcgis/core/widgets/LayerList';
import Legend from '@arcgis/core/widgets/Legend';
import Expand from '@arcgis/core/widgets/Expand';
import { initializeArcGISConfig, widgetConfig } from '../config/arcgis';
import { useAppSelector } from './redux';

interface UseMapOptions {
  webMapId: string;
  center: [number, number];
  zoom: number;
}

export const useMap = ({ webMapId, center, zoom }: UseMapOptions) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  console.log('useMap initialized with webMapId:', webMapId, 'authenticated:', isAuthenticated);
  const viewRef = useRef<MapView | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [waitingForAuth, setWaitingForAuth] = useState(true);

  const initializeMap = async () => {
    // if (!mapRef.current || mapInitialized) {
    //   console.log('Map initialization skipped:', { 
    //     hasContainer: !!mapRef.current, 
    //     mapInitialized 
    //   });
    //   return;
    // }

    // Wait for authentication before initializing map
    if (!isAuthenticated) {
      console.log('Waiting for user authentication before initializing map...');
      setWaitingForAuth(true);
      return;
    }

    try {
      console.log('Starting map initialization with authenticated user...');
      setIsLoading(true);
      setError(null);
      setWaitingForAuth(false);

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
      
      // Since we're waiting for authentication, we can now confidently load the WebMap
      try {
        console.log('User is authenticated, loading WebMap with ID:', webMapId);
        const webmap = new WebMap({
          portalItem: {
            id: webMapId,
          },
        });
        
        // Wait for the WebMap to load
        await webmap.load();
        map = webmap;
        console.log('Successfully loaded WebMap:', webMapId);
      } catch (webMapError) {
        console.warn('Failed to load WebMap, falling back to basic map:', webMapError);
        console.log('Creating basic map with basemap...');
        map = new Map({
          basemap: 'streets-navigation-vector'
        });
      }

      // Create the MapView
      console.log('Creating MapView with container:', !!mapRef.current);
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: center,
        zoom: zoom
      });

      // Store view reference
      viewRef.current = view;
      console.log('MapView created successfully');

      // Wait for view to be ready with timeout
      console.log('Waiting for MapView to be ready...');
      const viewReadyTimeout = setTimeout(() => {
        console.warn('MapView taking longer than expected to load');
      }, 10000);

      try {
        await view.when();
        clearTimeout(viewReadyTimeout);
        console.log('MapView ready successfully');
      } catch (viewError) {
        clearTimeout(viewReadyTimeout);
        console.error('MapView failed to initialize:', viewError);
        throw viewError;
      }

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

  // Initialize map when authentication is successful
  useEffect(() => {
    if (isAuthenticated && !mapInitialized) {
      console.log('User authenticated, initializing map...');
      initializeMap();
    }
  }, [isAuthenticated, mapInitialized]);

  return {
    view: viewRef.current,
    isLoading,
    error,
    mapRef,
    initializeMap,
    waitingForAuth,
    retry: () => {
      setError(null);
      setMapInitialized(false);
      if (isAuthenticated) {
        initializeMap();
      }
    }
  };
};
