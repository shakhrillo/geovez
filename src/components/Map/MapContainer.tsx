import { useEffect } from 'react';
import { defaultMapConfig } from '../../config/arcgis';
import { useMap } from '../../hooks/useMap';

interface MapContainerProps {
  webMapId?: string;
  center?: [number, number];
  zoom?: number;
}

const MapContainer = ({ 
  webMapId = defaultMapConfig.defaultWebMapId,
  center = defaultMapConfig.center,
  zoom = defaultMapConfig.zoom 
}: MapContainerProps = {}) => {
  
  const { isLoading, error, retry, mapRef, initializeMap } = useMap({
    webMapId,
    center,
    zoom
  });

  // Initialize map when component mounts and container is available
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeMap();
    }, 100); // Small delay to ensure DOM is ready

    // Add a timeout to prevent infinite loading
    const timeoutTimer = setTimeout(() => {
      if (isLoading) {
        console.error('Map initialization timeout after 30 seconds');
        // Force error state if still loading after 30 seconds
      }
    }, 30000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timeoutTimer);
    };
  }, [initializeMap]);

  // Render loading state
  if (isLoading) {
    return (
      <div 
        className="map-container"
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--geovez-background, #F5F7FA)',
          color: 'var(--geovez-text-secondary, #6C757D)',
          textAlign: 'center',
          padding: '3rem',
          fontFamily: "'Avenir Next', system-ui, Avenir, Helvetica, Arial, sans-serif"
        }}
        data-tour="map-container"
      >
        <div style={{
          fontSize: '4rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, var(--geovez-primary, #0079C1), var(--geovez-primary-dark, #005CE6))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>🗺️</div>
        <h3 style={{
          color: 'var(--geovez-text, #2B2D42)',
          fontSize: '1.5rem',
          fontWeight: 600,
          marginBottom: '1rem'
        }}>Map Loading...</h3>
        <p style={{
          fontSize: '1rem',
          marginBottom: '0.5rem',
          color: 'var(--geovez-text-secondary, #6C757D)'
        }}>Initializing mapping components...</p>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--geovez-text-secondary, #6C757D)',
          opacity: 0.8
        }}><small>Loading basic map (authentication not yet configured)</small></p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div 
        className="map-container"
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ffe6e6, #fff0f0)',
          color: '#d63031',
          textAlign: 'center',
          padding: '3rem',
          fontFamily: "'Avenir Next', system-ui, Avenir, Helvetica, Arial, sans-serif"
        }}
        data-tour="map-container"
      >
        <div style={{
          fontSize: '4rem',
          marginBottom: '1.5rem',
          color: '#d63031'
        }}>⚠️</div>
        <h3 style={{
          color: '#d63031',
          fontSize: '1.5rem',
          fontWeight: 600,
          marginBottom: '1rem'
        }}>Map Error</h3>
        <p style={{
          fontSize: '1rem',
          marginBottom: '0.5rem'
        }}>Failed to load the mapping component.</p>
        <p style={{
          fontSize: '0.9rem',
          opacity: 0.8,
          marginBottom: '1rem'
        }}><small>Error: {error}</small></p>
        <button 
          onClick={retry}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#d63031',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="map-container"
      style={{ width: '100%', height: '100%' }}
      data-tour="map-container"
    />
  );
};

export default MapContainer;
