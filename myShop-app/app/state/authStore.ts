import { create } from "zustand";

type User = {
  email: string;
  name: string;
};

const useAuthStore = create<{
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

export default useAuthStore;
