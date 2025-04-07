import { createSlice } from '@reduxjs/toolkit';

// Define initial state
const initialState = {
  theme: 'light',
  notifications: [],
  modals: {
    addAppointment: false,
    addPartner: false,
    confirmDelete: false,
  },
  activeTab: 'home',
  refreshing: false,
  snackbar: {
    visible: false,
    message: '',
    type: 'info', // 'info', 'success', 'error', 'warning'
    duration: 3000,
  },
};

// Create slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    
    // Notifications
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Modals
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    
    // Active Tab
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    
    // Refreshing
    setRefreshing: (state, action) => {
      state.refreshing = action.payload;
    },
    
    // Snackbar
    showSnackbar: (state, action) => {
      state.snackbar = {
        visible: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
        duration: action.payload.duration || 3000,
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.visible = false;
    },
  },
});

// Export actions and reducer
export const {
  setTheme,
  toggleTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  setActiveTab,
  setRefreshing,
  showSnackbar,
  hideSnackbar,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectTheme = (state) => state.ui.theme;
export const selectNotifications = (state) => state.ui.notifications;
export const selectModals = (state) => state.ui.modals;
export const selectActiveTab = (state) => state.ui.activeTab;
export const selectRefreshing = (state) => state.ui.refreshing;
export const selectSnackbar = (state) => state.ui.snackbar;
