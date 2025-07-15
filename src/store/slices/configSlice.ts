import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  contactUs?: string;
  feedback?: string;
}

interface AppConfig {
  organisation: string;
  appTitle: string;
  logoUrl: string;
  theme: ThemeColors;
  socialLinks: SocialLinks;
  clientId: string;
  portalUrl: string;
  defaultMapId?: string;
}

interface ConfigState {
  config: AppConfig | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConfigState = {
  config: null,
  loading: false,
  error: null,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<AppConfig>) => {
      state.config = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearConfig: (state) => {
      state.config = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setConfig, setLoading, setError, clearConfig } = configSlice.actions;

export default configSlice.reducer;
