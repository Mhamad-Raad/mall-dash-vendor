import { axiosInstance } from '@/data/axiosInstance';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_VALUE = import.meta.env.VITE_API_VALUE;
const APP_CONTEXT = import.meta.env.VITE_APP_CONTEXT;

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post(
      '/Account/login',
      {
        email,
        password,
        applicationContext: APP_CONTEXT,
      },
      {
        headers: { key: API_KEY, value: API_VALUE },
      }
    );

    const data = response.data;

    if (data.accessToken && data.refreshToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }

    return data;
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const logoutUser = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    // Optional: Call backend to invalidate refresh token server-side
    if (accessToken) {
      await axiosInstance.post(
        '/Account/logout',
        { accessToken },
        {
          headers: { key: API_KEY, value: API_VALUE },
        }
      );
    }
  } catch (error: any) {
    console.error(
      'Logout error:',
      error.response?.data?.message || error.message
    );
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('me');
    localStorage.removeItem('vendorProfile');

    window.dispatchEvent(new Event('force-logout'));
  }
};

export const fetchMe = async () => {
  try {
    const response = await axiosInstance.get('/Account/me', {
      headers: { key: API_KEY, value: API_VALUE },
    });

    const data = response.data;

    // Map the response to MeType
    // Current API response: { id, firstName, lastName, email, phoneNumber, roles: ["Vendor"] }
    // Expected MeType: { _id, firstName, lastName, email, phoneNumber, profileImageUrl, role }

    const roleMapping: Record<string, number> = {
      Admin: 0,
      Vendor: 1,
      User: 2,
    };

    // Safely handle roles array
    const userRoleStr =
      Array.isArray(data.roles) && data.roles.length > 0
        ? data.roles[0]
        : 'User';
    const userRole =
      roleMapping[userRoleStr] !== undefined ? roleMapping[userRoleStr] : 2;

    const mappedUser = {
      _id: data.id || data._id, // Handle both just in case
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      profileImageUrl: data.profileImageUrl || null,
      role: userRole,
    };

    return {
      user: mappedUser,
      vendorProfile: null, // Not provided in current 'me' endpoint response
    };
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message };
  }
};
