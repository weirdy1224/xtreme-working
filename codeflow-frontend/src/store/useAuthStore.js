import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  // Start in checking state to avoid premature redirects before first checkAuth completes
  isCheckingAuth: true,
  isEmailVerified: false,
  verificationStatus: 'pending', // 'pending', 'loading', 'success', 'error'
  isVerifying: false,
  justLoggedOut: false, 
  hasAttemptedAuth: false, // Tracks if at least one auth attempt finished (success or fail)

  checkAuth: async () => {
    // Skip auth check if user just logged out to prevent race condition
    const { justLoggedOut } = get();
    if (justLoggedOut) {
      console.log('🚫 Skipping checkAuth - user just logged out');
      set({ justLoggedOut: false, isCheckingAuth: false, hasAttemptedAuth: true }); // Reset flag & mark attempt
      return false;
    }

    // Ensure checking flag true
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get('/auth/profile');
      console.log('Checkauth response: ', res.data);

      const userData = res.data.data;

      set({
        authUser: userData,
        isEmailVerified: userData?.isEmailVerified || false,
      });
      return true;
    } catch (error) {
      // Handle all errors gracefully
      if (error.response?.status === 401) {
        console.log('User not authenticated (expected)');
      } else {
        console.log('❌ Error checking auth:', error.message);
      }

      set({
        authUser: null,
        isEmailVerified: false,
      });
      return false;
    } finally {
  set({ isCheckingAuth: false, hasAttemptedAuth: true });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/register', data);

      toast.success(
        res.data.message || 'Account created! Please verify your email.'
      );
      return true;
    } catch (error) {
      console.log('Error signing up', error);
      toast.error(error.response?.data?.message || 'Error signing up');
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  verify: async (verificationToken) => {
    const state = get();

    if (state.isVerifying || state.verificationStatus === 'success') {
      console.log('🚫 Verification already in progress or completed');
      return;
    }

    console.log('🔄 Starting verification for token:', verificationToken);
    set({ verificationStatus: 'loading', isVerifying: true });

    try {
      const res = await axiosInstance.get(
        `/auth/verifyEmail/${verificationToken}`
      );
      console.log('✅ Verification successful:', res.data);
      const userData = res.data.data;

      set({
        authUser: userData,
        isEmailVerified: true,
        verificationStatus: 'success',
        isVerifying: false,
      });

      toast.success(res.data.message || 'Email verified successfully!');
    } catch (error) {
      console.log('❌ Error Verifying User', error);
      console.log('❌ Error response:', error.response?.data);

      if (
        error.response?.data?.message?.includes('already verified') ||
        error.response?.status === 400
      ) {
        console.log('📧 Email might already be verified');
        set({
          isEmailVerified: true,
          verificationStatus: 'success',
          isVerifying: false,
        });
        toast.success('Email is already verified!');
      } else {
        set({
          isEmailVerified: false,
          verificationStatus: 'error',
          isVerifying: false,
        });
        toast.error(error.response?.data?.message || 'Error verifying email');
      }
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);

      const userData = res.data.data;

      set({
        authUser: userData,
        isEmailVerified: userData?.isEmailVerified || false,
      });

      toast.success(res.data.message || 'Login successful!');
      return true;
    } catch (error) {
      console.log('Error logging in', error);
      toast.error(error.response?.data?.message || 'Error logging in');
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get('/auth/logout');
      
      // Force clear the specific cookies your backend uses + common variations
      const cookiesToClear = [
        'accessToken',    // Your backend uses this
        'refreshToken',   // Your backend uses this
        'token', 'jwt', 'authToken', 'auth-token', 'access_token'  // Common variations
      ];
      
      cookiesToClear.forEach(cookieName => {
        // Clear for current domain
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        
        // Also try with leading dot for subdomain cookies (production deployment)
        if (window.location.hostname.includes('.')) {
          const rootDomain = window.location.hostname.split('.').slice(-2).join('.');
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${rootDomain};`;
        }
      });

      set({
        authUser: null,
        isEmailVerified: false,
        justLoggedOut: true, // Set flag to prevent immediate checkAuth
        hasAttemptedAuth: true,
      });

      console.log('✅ Logout completed - auth state cleared');
      toast.success('Logout successful');
      
      // Clear any cached data to prevent stale state
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('auth') || name.includes('user')) {
              caches.delete(name);
            }
          });
        });
      }
      
    } catch (error) {
      console.log('Error logging out', error);
      
      // Even if backend logout fails, clear frontend state
      set({
        authUser: null,
        isEmailVerified: false,
        justLoggedOut: true,
        hasAttemptedAuth: true,
      });
      
      // Still try to clear cookies on error (focus on your backend cookie names)
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      toast.error('Error logging out');
    }
  },

  updateDetails: async (data) => {
    // data: { username, fullname }
    try {
      const res = await axiosInstance.post('/auth/updateProfile', data);
      const userData = res.data.data;
      set({ authUser: userData });
      toast.success(res.data.message || 'Profile updated successfully!');
      return true;
    } catch (error) {
      console.log('Error updating profile', error);
      toast.error(error.response?.data?.message || 'Error updating profile');
      return false;
    }
  },

  updateAvatar: async (imageFile) => {
    // imageFile: File object
    const formData = new FormData();
    formData.append('avatar', imageFile);
    try {
      const res = await axiosInstance.patch('/auth/updateAvatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const userData = res.data.data;
      set({ authUser: userData });
      toast.success(res.data.message || 'Avatar updated successfully!');
      return true;
    } catch (error) {
      console.log('Error updating avatar', error);
      toast.error(error.response?.data?.message || 'Error updating avatar');
      return false;
    }
  },
  // Helper to force clear auth state (used by axios interceptor)
  clearAuthState: () => {
    set({ authUser: null, isEmailVerified: false, justLoggedOut: true, hasAttemptedAuth: true });
  },
}));
