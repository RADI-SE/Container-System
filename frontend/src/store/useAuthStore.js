import { create } from 'zustand';
import axios from 'axios';

const API_URL = "/api/auth";
axios.defaults.withCredentials = true;

const normalizeUser = (rawUser) => {
  if (!rawUser) return null;
  const normalizedId = rawUser._id || rawUser.id || null;
  return {
    ...rawUser,
    _id: normalizedId,
    id: normalizedId,
  };
};

const useAuthStore = create((set) => ({
   
  user: null,
  staff: null,
  isAuthenticated: false,
  isLoading: false,
  isError: false,
  errorMessage: null,
  isCheckingAuth: true,

 
  signin: async (email, password) => {
    set({ isLoading: true, errorMessage: null, isError: false });

    try {
      const response = await axios.post(`${API_URL}/signin`, { email, password });

      if (response.data && response.data.user) {
        const user = normalizeUser(response.data.user);

        set({
          user,
          staff: user.role === 'staff' ? user : null, // Automatically set staff if role matches
          isAuthenticated: true,
          isLoading: false,
          isCheckingAuth: false,
          isError: false,
          errorMessage: null,
        });
        return user;
      } else {
        throw new Error("User data is missing in the response");
      }
    } catch (error) {
      set({
        isLoading: false,
        isError: true,
        errorMessage: error.response?.data?.message || error.message || "An error occurred during sign-in.",
      });
      throw error; 
    }
  },

  loginAsAdmin: () => {
    set({ 
      user: { name: "Admin", role: "admin" }, 
      staff: null,
      isAuthenticated: true,
      isCheckingAuth: false 
    });
  },

  loginAsStaff: () => {
    const defaultStaff = { name: "Staff Member", id: 1, role: "staff" };
    set({ 
      user: defaultStaff, 
      staff: defaultStaff,
      isAuthenticated: true,
      isCheckingAuth: false 
    });
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
    } catch (error) {
      // Always clear client auth state even if network/logout call fails.
    } finally {
      localStorage.removeItem('token');
      set({
        user: null,
        staff: null,
        isAuthenticated: false,
        errorMessage: null,
        isError: false,
        isCheckingAuth: false,
      });
    }
  }, 
checkAuth: async () => {
  set({ isCheckingAuth: true });

  try {  

    const response = await axios.get(`${API_URL}/check-auth`); 
    const user = normalizeUser(response.data.user);
    set({ 
      user,
      staff: user?.role === 'staff' ? user : null,
      isAuthenticated: true, 
      isCheckingAuth: false,
      isError: false,
      errorMessage: null,
    });
  } catch (error) {
    localStorage.removeItem('token');
    set({
      user: null,
      staff: null,
      isAuthenticated: false,
      isCheckingAuth: false,
    });
  }
},
 
  setAuthChecked: () => set({ isCheckingAuth: false })
}));

export default useAuthStore;