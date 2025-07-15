import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Declare global esri namespace
declare global {
  const esri: any;
}

interface UserInfo {
  username: string;
  fullName: string;
  email: string;
  role: string;
  orgId: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: true,
  user: null,
  token: "kTPqPMI7lrk_hRP3gNv92AwzH76jNpsB5lsTB9IQUW33AKVAEDKTAobgybQmPYvLWf9wxV44LbwDIb8hj_7uVnLwVSBG3Dc5jheS1plIgeezZYv",
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAuthentication: (state, action: PayloadAction<{ user: UserInfo; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    clearAuthentication: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setLoading, setError, setAuthentication, clearAuthentication } = authSlice.actions;

// Thunk for initializing OAuth
export const initializeOAuth = (clientId: string) => {
  return () => {
    // Check if ArcGIS API is loaded
    if (typeof window.esri === 'undefined') {
      console.warn('ArcGIS API not yet loaded, deferring OAuth initialization');
      return;
    }

    try {
      // Check if OAuth info is already registered
      const existingOAuth = window.esri.identity.IdentityManager.findOAuthInfo('https://www.arcgis.com/sharing/rest');
      
      if (!existingOAuth) {
        const oAuthInfo = new window.esri.identity.OAuthInfo({
          appId: clientId || 'geovez-web-app', // Use provided clientId or fallback
          popup: true,
          portalUrl: 'https://www.arcgis.com/sharing/rest',
          flowType: 'auto',
          popupCallbackUrl: window.location.origin + '/oauth-callback.html'
        });

        window.esri.identity.IdentityManager.registerOAuthInfos([oAuthInfo]);
        console.log('OAuth initialized successfully with redirect to:', window.location.origin);
      }
    } catch (error) {
      console.error('Failed to initialize OAuth:', error);
    }
  };
};

// Thunk for silent authentication check
export const checkExistingAuth = () => {
  return async (dispatch: any) => {
    if (typeof window.esri === 'undefined') {
      return;
    }

    try {
      // Check if this is an OAuth callback by looking for code and state parameters
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      
      if (code && state) {
        console.log('Processing OAuth callback...');
        // Let the ArcGIS IdentityManager handle the callback
        // It will automatically process the authorization code
      }
      
      // Check if user is already signed in or process the callback
      const credential = await window.esri.identity.IdentityManager.checkSignInStatus('https://www.arcgis.com/sharing/rest');
      
      if (credential && credential.token) {
        // Get user info
        const response = await fetch(`${credential.server}/community/self?f=json&token=${credential.token}`);
        const userInfo = await response.json();
        
        if (!userInfo.error && userInfo.username) {
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
          
          // Clean up URL if this was an OAuth callback
          if (code && state) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      }
    } catch (error) {
      // Silent failure - user is not signed in
      console.log('No existing authentication found:', error);
    }
  };
};

// Thunk for sign out
export const signOut = () => {
  return async (dispatch: any) => {
    try {
      if (window.esri && window.esri.identity.IdentityManager) {
        await window.esri.identity.IdentityManager.destroyCredentials();
      }
      dispatch(clearAuthentication());
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear local authentication state even if remote sign out fails
      dispatch(clearAuthentication());
    }
  };
};

export default authSlice.reducer;
