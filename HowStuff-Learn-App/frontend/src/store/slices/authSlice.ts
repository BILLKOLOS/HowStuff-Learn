import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encrypt, decrypt } from '@/lib/crypto';
import type { User, AuthResponse } from '@/types/auth';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    tokenExpiresAt: number | null;

    setUser: (user: User) => void;
    setTokens: (response: AuthResponse) => void;
    clearAuth: () => void;
    setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,
            isAuthenticated: false,
            tokenExpiresAt: null,

            setUser: (user) => set({ user }),
            setTokens: (response) => set({
                user: response.user,
                accessToken: response.token,
                refreshToken: response.refreshToken,
                tokenExpiresAt: Date.now() + response.expiresIn * 1000,
                isAuthenticated: true,
                error: null
            }),
            clearAuth: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    tokenExpiresAt: null,
                    error: null
                });
                sessionStorage.removeItem('auth-storage');
                sessionStorage.clear();
            },
            setError: (error) => set({ error })
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => ({
                getItem: async (key) => {
                    const value = sessionStorage.getItem(key);
                    return value ? await decrypt(value) : null;
                },
                setItem: async (key, value) => {
                    const encrypted = await encrypt(value);
                    sessionStorage.setItem(key, encrypted);
                },
                removeItem: (key) => sessionStorage.removeItem(key)
            }))
        }
    )
);
