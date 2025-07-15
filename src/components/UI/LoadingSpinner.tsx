import { useEffect, useState } from 'react';
import { CalciteLoader, CalciteButton } from '@esri/calcite-components-react';

const LoadingSpinner = () => {
  const [showSlowWarning, setShowSlowWarning] = useState(false);

  useEffect(() => {
    // Show warning if loading takes too long
    const timer = setTimeout(() => {
      setShowSlowWarning(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loading-spinner-container">
      <CalciteLoader scale="l" />
      <div className="loading-content">
        <h2 className="loading-title">Loading GeoVez</h2>
        <p className="loading-subtitle">Preparing your mapping experience...</p>
      </div>
      {showSlowWarning && (
        <div className="modern-card" style={{ marginTop: '2rem', textAlign: 'center', maxWidth: '400px' }}>
          <div className="card-title">Taking longer than expected?</div>
          <div className="card-content" style={{ marginBottom: '1rem' }}>
            The application is loading slowly. You can try refreshing the page.
          </div>
          <CalciteButton
            onClick={() => window.location.reload()}
            className="modern-button"
            iconStart="refresh"
          >
            Refresh Page
          </CalciteButton>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
