import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setAuthentication, setLoading, setError } from '../../store/slices/authSlice';
import { 
  CalciteModal,
  CalciteButton,
  CalciteLoader,
  CalciteIcon
} from '@esri/calcite-components-react';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal = ({ onClose }: AuthModalProps) => {
  const dispatch = useAppDispatch();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { error } = useAppSelector((state) => state.auth);

  const handleSignIn = async () => {
    if (!window.esri) {
      dispatch(setError('ArcGIS API not loaded. Please refresh the page and try again.'));
      return;
    }

    setIsSigningIn(true);
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      // Initialize OAuth if not already done
      if (!window.esri.identity.IdentityManager.findOAuthInfo('https://www.arcgis.com/sharing/rest')) {
        const oAuthInfo = new window.esri.identity.OAuthInfo({
          appId: 'geovez-web-app', // This should be replaced with your actual ArcGIS app ID
          popup: false,
          portalUrl: 'https://www.arcgis.com/sharing/rest',
          flowType: 'auto', // Use 'auto' for better user experience
          popupCallbackUrl: `https://localhost:3000/oauth-callback.html`
        });
        
        window.esri.identity.IdentityManager.registerOAuthInfos([oAuthInfo]);
      }

      // Get credential
      const credential = await window.esri.identity.IdentityManager.getCredential(
        'https://www.arcgis.com/sharing/rest',
        {
          oAuthPopupConfirmation: false,
          retry: true
        }
      );
      
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

      onClose();
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
            Sign in to your ArcGIS Online account to access maps, layers, and personalized content.
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
