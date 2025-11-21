import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ProductType } from '@/interfaces/Products.interface';
import {
  fetchProductById as fetchProductByIdAPI,
  updateProduct as updateProductAPI,
  deleteProduct as deleteProductAPI,
} from '@/data/Products';

const initialProduct: ProductType = {
  _id: '',
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  vendorId: '',
};

interface ProductState {
  product: ProductType;
  lproduct: boolean;
  eproduct: string | null;
  updating: boolean;
  updatingError: string | null;
  deleting: boolean;
  deletingError: string | null;
}

const initialState: ProductState = {
  product: initialProduct,
  lproduct: false,
  eproduct: null,
  updating: false,
  updatingError: null,
  deleting: false,
  deletingError: null,
};

export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (productId: string, { rejectWithValue }) => {
    const data = await fetchProductByIdAPI(productId);
    if (data.error) return rejectWithValue(data.error);
    return data;
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async (
    {
      id,
      update,
    }: {
      id: string;
      update: {
        name: string;
        description: string;
        price: number;
        imageFile?: File;
      };
    },
    { rejectWithValue }
  ) => {
    const apiPayload: any = {
      name: update.name,
      description: update.description,
      price: update.price,
    };

    if (update.imageFile instanceof File) {
      apiPayload.imageUrl = update.imageFile;
    }

    const data = await updateProductAPI(id, apiPayload);
    if (data.error) return rejectWithValue(data.error);
    return data;
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    const data = await deleteProductAPI(id);
    if (data.error) return rejectWithValue(data.error);
    return data;
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProduct: (state) => {
      state.product = initialProduct;
      state.eproduct = null;
      state.updating = false;
      state.updatingError = null;
      state.deleting = false;
      state.deletingError = null;
    },
    clearError: (state) => {
      state.eproduct = null;
      state.updatingError = null;
      state.deletingError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch product
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.lproduct = true;
        state.eproduct = null;
      })
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<ProductType>) => {
          state.lproduct = false;
          state.product = action.payload;
          state.eproduct = null;
        }
      )
      .addCase(fetchProductById.rejected, (state, action) => {
        state.lproduct = false;
        state.eproduct = (action.payload as string) || 'An error occurred';
      });

    // Update product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.updating = true;
        state.updatingError = null;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<ProductType>) => {
          state.updating = false;
          state.product = action.payload;
          state.updatingError = null;
        }
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.updating = false;
        state.updatingError = (action.payload as string) || 'An error occurred';
      });

    // Delete product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.deleting = true;
        state.deletingError = null;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.deleting = false;
        state.product = initialProduct;
        state.deletingError = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleting = false;
        state.deletingError = (action.payload as string) || 'An error occurred';
      });
  },
});

export const { clearProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
