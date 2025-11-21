import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ProductType } from '@/interfaces/Products.interface';
import { fetchProducts as fetchProductsAPI } from '@/data/Products';

interface ProductsState {
  products: ProductType[];
  lproducts: boolean;
  eproducts: string | null;
  limit: number;
  page: number;
  total: number;
}

const initialState: ProductsState = {
  products: [],
  lproducts: false,
  eproducts: null,
  limit: 10,
  page: 1,
  total: 10,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    params: {
      page?: number;
      limit?: number;
      searchTerm?: string;
      category?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const data = await fetchProductsAPI(params);

      if (data.error) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch products');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.eproducts = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.lproducts = true;
        state.eproducts = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: ProductType[];
            limit: number;
            page: number;
            total: number;
          }>
        ) => {
          state.lproducts = false;
          state.products = action.payload.data;
          state.limit = action.payload.limit;
          state.page = action.payload.page;
          state.total = action.payload.total;
          state.eproducts = null;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.lproducts = false;
        state.eproducts = action.payload as string;
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;
