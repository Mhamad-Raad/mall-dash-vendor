import { createSlice } from '@reduxjs/toolkit';
import type { MeType } from '@/interfaces/Auth.interface';

import type { PayloadAction } from '@reduxjs/toolkit';

interface MeState {
  user: MeType | null;
}

// Try to load from localStorage on initialization
const loadUserFromStorage = (): MeType | null => {
  try {
    const storedUser = localStorage.getItem('me');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Failed to load user from storage:', error);
    return null;
  }
};

const initialState: MeState = {
  user: loadUserFromStorage(),
};

const meSlice = createSlice({
  name: 'me',
  initialState,
  reducers: {
    setMe: (state, action: PayloadAction<MeType>) => {
      state.user = action.payload;
      localStorage.setItem('me', JSON.stringify(action.payload));
    },
    clearMe: (state) => {
      state.user = null;
      localStorage.removeItem('me');
    },
  },
});

export const { setMe, clearMe } = meSlice.actions;
export default meSlice.reducer;

