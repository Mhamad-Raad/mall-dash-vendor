import { axiosInstance } from '@/data/axiosInstance';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_VALUE = import.meta.env.VITE_API_VALUE;

export const fetchProducts = async (params?: {
  page?: number;
  limit?: number;
  searchName?: string;
  inStock?: boolean;
}) => {
  try {
    const response = await axiosInstance.get('/Product/my-products', {
      headers: { key: API_KEY, value: API_VALUE },
      params: {
        page: params?.page,
        limit: params?.limit,
        searchName: params?.searchName ?? undefined,
        inStock: params?.inStock ?? undefined,
      },
    });

    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`, {
      headers: { key: API_KEY, value: API_VALUE },
    });
    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const updateProduct = async (
  id: string,
  productData: {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    imageUrl?: File;
  }
) => {
  try {
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as any);
      }
    });

    const response = await axiosInstance.put(`/products/${id}`, formData, {
      headers: {
        key: API_KEY,
        value: API_VALUE,
      },
      transformRequest: [(data) => data],
    });

    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`, {
      headers: { key: API_KEY, value: API_VALUE },
    });
    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const createProduct = async (productData: {
  VendorId: number;
  CategoryId: number;
  Name: string;
  Description: string;
  Price: number;
  DiscountPrice?: number;
  InStock: boolean;
  IsWeightable: boolean;
  ProductImageUrl?: File | string;
}) => {
  try {
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (typeof value === 'boolean') {
        formData.append(key, value ? 'true' : 'false');
      } else {
        formData.append(key, value as any);
      }
    });

    const response = await axiosInstance.post('/Product', formData, {
      headers: {
        key: API_KEY,
        value: API_VALUE,
      },
      transformRequest: [(data) => data],
    });

    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};
