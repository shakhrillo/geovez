import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type DrawerContent = 'maps' | 'layers' | 'legend' | 'bookmarks' | 'tools' | 'print' | 'advanced-search' | null;

interface UIState {
  sideNavOpen: boolean;
  drawerOpen: boolean;
  drawerContent: DrawerContent;
  mobileMenuOpen: boolean;
  helpTourActive: boolean;
  loading: boolean;
}

const initialState: UIState = {
  sideNavOpen: true,
  drawerOpen: false,
  drawerContent: null,
  mobileMenuOpen: false,
  helpTourActive: false,
  loading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSideNav: (state) => {
      state.sideNavOpen = !state.sideNavOpen;
    },
    setSideNavOpen: (state, action: PayloadAction<boolean>) => {
      state.sideNavOpen = action.payload;
    },
    openDrawer: (state, action: PayloadAction<DrawerContent>) => {
      state.drawerOpen = true;
      state.drawerContent = action.payload;
    },
    closeDrawer: (state) => {
      state.drawerOpen = false;
      state.drawerContent = null;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    startHelpTour: (state) => {
      state.helpTourActive = true;
    },
    endHelpTour: (state) => {
      state.helpTourActive = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  toggleSideNav,
  setSideNavOpen,
  openDrawer,
  closeDrawer,
  toggleMobileMenu,
  setMobileMenuOpen,
  startHelpTour,
  endHelpTour,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
