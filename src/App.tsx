import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { setConfig } from './store/slices/configSlice';
import { initializeOAuth, checkExistingAuth } from './store/slices/authSlice';
import Header from './components/Layout/Header';
import SideNav from './components/Layout/SideNav';
import MapContainer from './components/Map/MapContainer';
import Drawer from './components/Layout/Drawer';
import Footer from './components/Layout/Footer';
import AuthModal from './components/Auth/AuthModal';
import HelpTour from './components/Help/HelpTour';
import LoadingSpinner from './components/UI/LoadingSpinner';
import { CalciteShell, CalciteShellPanel } from '@esri/calcite-components-react';
import '@esri/calcite-components/dist/calcite/calcite.css';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const { config, loading: configLoading } = useAppSelector((state) => state.config);
  // @ts-ignore - Temporary fix for Redux state typing issue
  const { sideNavOpen, drawerOpen } = useAppSelector((state) => state.ui);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [arcgisLoaded, setArcgisLoaded] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [processingOAuth, setProcessingOAuth] = useState(false);

  useEffect(() => {
    // Initialize app immediately with a timeout for ArcGIS
    const initializeApp = () => {
      // Get organization from URL or use default
      const urlParams = new URLSearchParams(window.location.search);
      const organisation = urlParams.get('organisation') || 'copper-string';
      
      // Load configuration
      loadAppConfig(organisation);
    };

    // Check if this is an OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      console.log('OAuth callback detected, processing...');
      setProcessingOAuth(true);
      // This is an OAuth callback - let ArcGIS handle it
      // The checkExistingAuth will be called after config is loaded
    }

    // Start initialization immediately
    initializeApp();

    // Set a longer timeout for ArcGIS loading (10 seconds)
    const arcgisTimeout = setTimeout(() => {
      if (!arcgisLoaded) {
        console.warn('ArcGIS API loading timeout, proceeding without it');
        setArcgisLoaded(true);
      }
    }, 10000);

    // Check for ArcGIS API loading with better detection
    const checkArcGIS = () => {
      // Check if ArcGIS is available and fully loaded
      if (typeof window !== 'undefined' && 
          (window.esri || (window as any).require)) {
        clearTimeout(arcgisTimeout);
        setArcgisLoaded(true);
        return true;
      }
      return false;
    };

    // Immediate check
    if (checkArcGIS()) {
      return () => clearTimeout(arcgisTimeout);
    }

    // Periodic check
    const checkInterval = setInterval(() => {
      if (checkArcGIS()) {
        clearInterval(checkInterval);
      }
    }, 500);

    // Cleanup
    return () => {
      clearInterval(checkInterval);
      clearTimeout(arcgisTimeout);
    };
  }, []);

  const loadAppConfig = async (organisation: string) => {
    try {
      // For demo purposes, using mock config. Replace with actual API call
      const mockConfig = {
        organisation,
        appTitle: 'GeoVez Web Mapping',
        logoUrl: '/logo.png',
        theme: {
          primary: '#0079C1',
          secondary: '#005CE6',
          accent: '#00B6F0',
          background: '#F8F8F8',
          surface: '#FFFFFF',
          text: '#323232',
        },
        socialLinks: {
          facebook: 'https://facebook.com',
          twitter: 'https://twitter.com',
          linkedin: 'https://linkedin.com',
          contactUs: 'mailto:contact@geovez.com',
          feedback: 'mailto:feedback@geovez.com',
        },
        clientId: 'arcgis-js-api-demo-app', // Using a demo/public client ID for testing
        portalUrl: 'https://www.arcgis.com/sharing/rest',
      };

      dispatch(setConfig(mockConfig));
      
      // Initialize OAuth only if ArcGIS API is loaded
      if (window.esri) {
        dispatch(initializeOAuth(mockConfig.clientId));
        // Check for existing authentication
        const authPromise = dispatch(checkExistingAuth() as any);
        
        // If processing OAuth callback, wait for it to complete
        if (processingOAuth) {
          authPromise.finally(() => {
            setProcessingOAuth(false);
          });
        }
      }
    } catch (error) {
      console.error('Failed to load app config:', error);
    }
  };

  // Auto-show auth modal when app loads and user is not authenticated
  useEffect(() => {
    if (arcgisLoaded && config && !isAuthenticated && !processingOAuth) {
      // Add a small delay to ensure UI is ready
      const timer = setTimeout(() => {
        setShowAuthModal(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [arcgisLoaded, config, isAuthenticated, processingOAuth]);

  // Auto-close auth modal when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && showAuthModal) {
      setShowAuthModal(false);
    }
  }, [isAuthenticated, showAuthModal]);

  if (configLoading || !config) {
    return <LoadingSpinner />;
  }

  // Show loading until ArcGIS is loaded or timeout
  if (!arcgisLoaded || processingOAuth) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--geovez-background, #F5F7FA)'
      }}>
        <LoadingSpinner />
        {processingOAuth && (
          <p style={{ 
            marginTop: '1rem', 
            color: 'var(--geovez-text-secondary, #6C757D)',
            fontSize: '1rem'
          }}>
            Processing sign-in...
          </p>
        )}
      </div>
    );
  }

  return (
    <CalciteShell className="app-shell">
      {/* Header */}
      <Header 
        onSignInClick={() => setShowAuthModal(true)}
        config={config}
      />

      {/* Side Navigation */}
      <CalciteShellPanel 
        slot="panel-start" 
        collapsed={!sideNavOpen}
        position="start"
        width-scale="s"
      >
        <SideNav />
      </CalciteShellPanel>

      {/* Main Content Area */}
      <div className="main-content">
        <MapContainer />
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <CalciteShellPanel 
          slot="panel-end" 
          position="end"
          width-scale="m"
        >
          <Drawer />
        </CalciteShellPanel>
      )}

      {/* Footer */}
      <Footer config={config} />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Help Tour */}
      <HelpTour />
    </CalciteShell>
  );
}

export default App;
