import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Add response interceptor to handle logout scenarios
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get 401 and we're not on login/signup page, it means session expired
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (!['/login', '/signup', '/verify-email'].includes(currentPath)) {
        console.log('🔒 Session expired - clearing auth state');
        import('../store/useAuthStore.js').then(({ useAuthStore }) => {
          // Use helper to safely clear
          const { clearAuthState } = useAuthStore.getState();
          if (clearAuthState) clearAuthState();
        });
      }
    }
    return Promise.reject(error);
  }
);
