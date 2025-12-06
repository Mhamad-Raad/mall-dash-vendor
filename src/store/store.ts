import { configureStore } from '@reduxjs/toolkit';

import usersReducer from './slices/usersSlice';
import userReducer from './slices/userSlice';
import productsReducer from './slices/productsSlice';
import productReducer from './slices/productSlice';
import meReducer from './slices/meSlice';
import vendorReducer from './slices/vendorSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    user: userReducer,
    products: productsReducer,
    product: productReducer,
    me: meReducer,
    vendor: vendorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
