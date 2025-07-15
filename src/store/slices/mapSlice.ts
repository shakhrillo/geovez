import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface MapItem {
  id: string;
  title: string;
  snippet: string;
  thumbnailUrl: string;
  owner: string;
  created: number;
  modified: number;
}

interface MapState {
  currentMapId: string | null;
  availableMaps: MapItem[];
  loading: boolean;
  error: string | null;
  layerListVisible: boolean;
  legendVisible: boolean;
}

const initialState: MapState = {
  currentMapId: null,
  availableMaps: [],
  loading: false,
  error: null,
  layerListVisible: false,
  legendVisible: false,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setCurrentMapId: (state, action: PayloadAction<string | null>) => {
      state.currentMapId = action.payload;
    },
    setAvailableMaps: (state, action: PayloadAction<MapItem[]>) => {
      state.availableMaps = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLayerListVisible: (state, action: PayloadAction<boolean>) => {
      state.layerListVisible = action.payload;
    },
    setLegendVisible: (state, action: PayloadAction<boolean>) => {
      state.legendVisible = action.payload;
    },
  },
});

export const {
  setCurrentMapId,
  setAvailableMaps,
  setLoading,
  setError,
  setLayerListVisible,
  setLegendVisible,
} = mapSlice.actions;

export default mapSlice.reducer;
