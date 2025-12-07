import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { VendorProfileType } from '@/interfaces/Auth.interface';

interface VendorState {
  profile: VendorProfileType | null;
}

// Try to load from localStorage on initialization
const loadVendorFromStorage = (): VendorProfileType | null => {
  try {
    const storedVendor = localStorage.getItem('vendorProfile');
    return storedVendor ? JSON.parse(storedVendor) : null;
  } catch (error) {
    console.error('Failed to load vendor profile from storage:', error);
    return null;
  }
};

const initialState: VendorState = {
  profile: loadVendorFromStorage(),
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    setVendorProfile: (state, action: PayloadAction<VendorProfileType>) => {
      state.profile = action.payload;
      localStorage.setItem('vendorProfile', JSON.stringify(action.payload));
    },
    clearVendorProfile: (state) => {
      state.profile = null;
      localStorage.removeItem('vendorProfile');
    },
  },
});

export const { setVendorProfile, clearVendorProfile } = vendorSlice.actions;
export default vendorSlice.reducer;

