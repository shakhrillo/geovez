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
  isAuthenticated: false,
  user: null,
  token: null,
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
          popup: false,
          portalUrl: 'https://www.arcgis.com/sharing/rest',
          flowType: 'auto',
          popupCallbackUrl: window.location.origin + '/oauth-callback.html'
        });

        window.esri.identity.IdentityManager.registerOAuthInfos([oAuthInfo]);
        console.log('OAuth initialized successfully');
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
      // Check if user is already signed in
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
        }
      }
    } catch (error) {
      // Silent failure - user is not signed in
      console.log('No existing authentication found');
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
