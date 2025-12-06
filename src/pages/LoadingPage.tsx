import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import Layout from '@/components/Layout/DashboardLayout';
import {
  getStoredTokens,
  validateRefreshToken,
  clearTokens,
} from '@/utils/authUtils';
import { logoutUser, fetchMe } from '@/data/Authorization';
import Logo from '@/assets/Logo.jpg';
import { Loader2 } from 'lucide-react';
import type { RootState } from '@/store/store';
import { setMe, clearMe } from '@/store/slices/meSlice';
import {
  setVendorProfile,
  clearVendorProfile,
} from '@/store/slices/vendorSlice';

const LoadingPage = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.me);
  const { profile } = useSelector((state: RootState) => state.vendor);

  useEffect(() => {
    const handler = () => {
      dispatch(clearMe());
      dispatch(clearVendorProfile());
      navigate('/login', { replace: true });
    };
    window.addEventListener('force-logout', handler);
    return () => window.removeEventListener('force-logout', handler);
  }, [navigate, dispatch]);

  useEffect(() => {
    const checkAuth = async () => {
      const { refreshToken } = getStoredTokens();
      if (!refreshToken) {
        setIsAuthorized(false);
        return;
      }
      const refreshTokenIsValid = await validateRefreshToken(refreshToken);
      if (!refreshTokenIsValid) {
        clearTokens();
        setIsAuthorized(false);
        return;
      }

      // Check only token validity for now

      // Always fetch user and vendor profile to ensure data freshness
      // Removed per user request for now
      /*
      try {
        const response = await fetchMe();
        if (response.error || !response.user) {
          // Failed to fetch me data or data is incomplete
          toast.error(
            'Session expired or invalid data. Please log in again.'
          );
          await logoutUser();
          return;
        }

        // Populate reducers
        dispatch(setMe(response.user));
        if (response.vendorProfile) {
          dispatch(setVendorProfile(response.vendorProfile));
        } else {
          dispatch(clearVendorProfile());
        }
      } catch (error) {
        console.error('Error fetching me data:', error);
        toast.error('An error occurred. Please log in again.');
        await logoutUser();
        return;
      }
      */

      setIsAuthorized(true);
    };

    // Give time for localStorage update after login
    const timer = setTimeout(() => {
      checkAuth();
    }, 50);

    return () => clearTimeout(timer);
    // Removed user and profile from dependencies to prevent infinite loop
  }, [dispatch]);

  useEffect(() => {
    if (isAuthorized === false) {
      navigate('/login', { replace: true });
    }
  }, [isAuthorized, navigate]);

  if (isAuthorized === null) {
    return (
      <div className='flex flex-col justify-center items-center h-screen'>
        <img
          src={Logo}
          alt='Company Logo'
          className='w-32 h-32 object-contain'
          style={{ animation: 'bw-pulse 2.5s infinite' }}
        />
        <Loader2 className='mt-8 h-8 w-8 animate-spin text-gray-800' />
      </div>
    );
  }

  return (
    <>
      <Layout />
    </>
  );
};

export default LoadingPage;
