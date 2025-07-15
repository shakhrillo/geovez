import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setAuthentication, setLoading, setError } from '../../store/slices/authSlice';
import { 
  CalciteModal,
  CalciteButton,
  CalciteLoader,
  CalciteIcon
} from '@esri/calcite-components-react';
import esriId from "@arcgis/core/identity/IdentityManager";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal = ({ onClose }: AuthModalProps) => {
  const dispatch = useAppDispatch();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Auto-close modal when authentication is successful
  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    dispatch(setLoading(true));
    dispatch(setError(null));

    const portalUrl = 'https://basecg.maps.arcgis.com';
    const APP_ID = 'seHOOIqBj2A5kubt'; // This should be replaced with your actual ArcGIS app ID

    try {
      const credential = await toggleLogin(portalUrl, APP_ID);
      
      if (!credential || !credential.token) {
        throw new Error('Failed to obtain authentication credential');
      }

      // Get user info with better error handling
      const userInfoUrl = `${credential.server}/community/self?f=json&token=${credential.token}`;
      const response = await fetch(userInfoUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.status} ${response.statusText}`);
      }
      
      const userInfo = await response.json();
      
      if (userInfo.error) {
        throw new Error(userInfo.error.message || 'Failed to get user information');
      }

      // Validate required user info
      if (!userInfo.username) {
        throw new Error('Invalid user information received');
      }

      dispatch(setAuthentication({
        user: {
          username: userInfo.username,
          fullName: userInfo.fullName || userInfo.username,
          email: userInfo.email || '',
          role: userInfo.role || 'user',
          orgId: userInfo.orgId || '',
        },
        token: credential.token,
      }));

      // Note: Modal will auto-close via useEffect when isAuthenticated becomes true
    } catch (error) {
      console.error('Sign in failed:', error);
      let errorMessage = 'Failed to sign in. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('popup')) {
          errorMessage = 'Sign in was cancelled or blocked. Please allow popups and try again.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('ArcGIS')) {
          errorMessage = 'ArcGIS service unavailable. Please try again later.';
        } else {
          errorMessage = error.message;
        }
      }
      
      dispatch(setError(errorMessage));
    } finally {
      setIsSigningIn(false);
      dispatch(setLoading(false));
    }
  };

  // Request login or logout user
  const toggleLogin = async (portalUrl: string, APP_ID: string) => {
    const oAuthInfo = esriId.findOAuthInfo(portalUrl);
    const sharingURL = `${portalUrl}/sharing`;
    const logOutURL = `${portalUrl}/sharing/rest/oauth2/signout`;

    try {
      await esriId.checkSignInStatus(sharingURL);
      esriId.destroyCredentials();
      oAuthInfo && oAuthInfo.destroy();

      const href = window.location.href;
      const redirect_uri = href.split("?")[0];
      const client_id = "arcgisonline";
      const url = `${logOutURL}?client_id=${client_id}&redirect_uri=${redirect_uri}`;
      await fetch(url);

      // Note: In a real app, you'd call logOutOfApp() here
      // logOutOfApp();
    } catch (error) {
      if (!oAuthInfo) {
        const authInfo = new OAuthInfo({
          appId: APP_ID,
          portalUrl,
          popup: true
        });

        esriId.registerOAuthInfos([authInfo]);
      }

      // Login user - this will redirect to ArcGIS for authentication
      return esriId.getCredential(sharingURL);
    }
  };

  return (
    <CalciteModal open={true} aria-labelledby="auth-modal-title" className="modern-auth-modal">
      <div slot="header" id="auth-modal-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CalciteIcon icon="sign-in" scale="m" />
          Sign In to ArcGIS Online
        </div>
      </div>
      
      <div slot="content" className="auth-modal-content">
        <div className="auth-modal-header">
          <h3 className="auth-modal-title">Welcome to GeoVez</h3>
          <p className="auth-modal-subtitle">
            Authentication is required to access the mapping platform. Sign in to your ArcGIS Online account to view maps, layers, and personalized content.
          </p>
        </div>
        
        {error && (
          <div style={{ 
            background: 'var(--calcite-color-status-danger-subtle)', 
            border: '1px solid var(--calcite-color-status-danger)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            color: 'var(--calcite-color-status-danger)'
          }}>
            <CalciteIcon icon="exclamation-mark-triangle" scale="s" style={{ marginRight: '0.5rem' }} />
            {error}
          </div>
        )}
        
        {isSigningIn && (
          <div className="signing-in">
            <CalciteLoader scale="s" />
            <span>Connecting to ArcGIS Online...</span>
          </div>
        )}
      </div>

      <CalciteButton
        slot="primary"
        onClick={handleSignIn}
        disabled={isSigningIn}
        iconStart="sign-in"
        className="modern-button"
      >
        Sign In with ArcGIS Online
      </CalciteButton>

      <CalciteButton
        slot="secondary"
        onClick={onClose}
        appearance="outline"
        disabled={isSigningIn}
        className="modern-button secondary"
      >
        Cancel
      </CalciteButton>
    </CalciteModal>
  );
};

export default AuthModal;
