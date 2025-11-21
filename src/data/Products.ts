import { axiosInstance } from '@/data/axiosInstance';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_VALUE = import.meta.env.VITE_API_VALUE;

export const fetchProducts = async (params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: string;
}) => {
  try {
    const response = await axiosInstance.get('/products', {
      headers: { key: API_KEY, value: API_VALUE },
      params,
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
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: File;
}) => {
  try {
    const hasFile = productData.imageUrl instanceof File;

    if (hasFile) {
      const formData = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value as any);
        }
      });

      const response = await axiosInstance.post('/products', formData, {
        headers: {
          key: API_KEY,
          value: API_VALUE,
        },
        transformRequest: [(data) => data],
      });

      return response.data;
    } else {
      const response = await axiosInstance.post('/products', productData, {
        headers: {
          key: API_KEY,
          value: API_VALUE,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    }
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};
