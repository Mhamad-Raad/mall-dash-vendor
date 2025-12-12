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
      // Check session validity using HTTP-only cookie
      const isValid = await validateRefreshToken();

      if (!isValid) {
        dispatch(clearMe());
        dispatch(clearVendorProfile());
        setIsAuthorized(false);
        return;
      }

      setIsAuthorized(true);
    };

    // Give time for cookie to be set/checked
    const timer = setTimeout(() => {
      checkAuth();
    }, 50);

    return () => clearTimeout(timer);
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
