import { create } from 'zustand';
import type { User } from '@/types/auth';

interface StoreState {
    user: User | null;
    error: string | null;
    setUser: (user: User | null) => void;
    setError: (error: string) => void;
    clearError: () => void;
}

export const store = create<StoreState>((set) => ({
    user: null,
    error: null,

    setUser: (user: User | null) => set({ user }),

    setError: (error: string) => set({ error }),

    clearError: () => set({ error: null }),
}));
