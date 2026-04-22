import { create } from 'zustand';
import axios from 'axios';

const API_URL = "/api/auth";
axios.defaults.withCredentials = true;

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
        const { user, token } = response.data;
        
        localStorage.setItem('token', token);

        set({
          user: user,
          staff: user.role === 'staff' ? user : null, // Automatically set staff if role matches
          isAuthenticated: true,
          isLoading: false,
          isCheckingAuth: false,
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

  logout: () => {
    localStorage.removeItem('token');
    set({ 
      user: null, 
      staff: null, 
      isAuthenticated: false,
      errorMessage: null,
      isError: false 
    });
  }, 
checkAuth: async () => {
  set({ isCheckingAuth: true });
  const token = localStorage.getItem('token');

  if (!token) {
    set({ isCheckingAuth: false, isAuthenticated: false, user: null });
    return;
  }

  try {  

    const response = await axios.get(`${API_URL}/check-auth`); 
    set({ 
      user: response.data.user, 
      isAuthenticated: true, 
      isCheckingAuth: false 
    });
  } catch (error) {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false, isCheckingAuth: false });
  }
},
 
  setAuthChecked: () => set({ isCheckingAuth: false })
}));

export default useAuthStore;