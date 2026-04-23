'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      token: null,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await axios.post(`${API}/auth/login`, { email, password }, { withCredentials: true });
          set({ user: data.user, token: data.token, isLoading: false });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
      },

      register: async (name, email, phone, password) => {
        set({ isLoading: true });
        try {
          const { data } = await axios.post(`${API}/auth/register`, { name, email, phone, password }, { withCredentials: true });
          set({ user: data.user, token: data.token, isLoading: false });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
      },

      logout: async () => {
        try {
          await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
        } catch (_) {}
        set({ user: null, token: null });
      },

      fetchMe: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const { data } = await axios.get(`${API}/auth/me`, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ user: data.user });
        } catch (_) {
          set({ user: null, token: null });
        }
      },

      isAuthenticated: () => !!get().user,
      isAdmin: () => get().user?.role === 'admin',
    }),
    { name: 'lens-auth', version: 1 }
  )
);

export default useAuthStore;
