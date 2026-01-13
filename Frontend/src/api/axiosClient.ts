
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000', // Ensure this matches your backend port
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: Allows sending/receiving Cookies (JWT)
});

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Return data directly if available
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle Session Expiry globally
    if (error.response && error.response.status === 401) {
        // Only clear if it's strictly an auth error not login failure
        if (!window.location.hash.includes('login')) {
             localStorage.removeItem('bms_user');
             window.location.href = '/#/login';
        }
    }
    console.error("API Error:", error?.response?.data || error.message);
    throw error;
  }
);

export default axiosClient;
