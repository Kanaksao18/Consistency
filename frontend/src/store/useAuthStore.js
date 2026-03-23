import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
      fetchUser: async () => {
        try {
          const api = (await import('../api/axios')).default;
          const { data } = await api.get('/auth/user');
          set({ user: data });
        } catch (err) {
          console.error('Failed to fetch user:', err);
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
