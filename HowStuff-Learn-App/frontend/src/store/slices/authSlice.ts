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
  validateToken: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      tokenExpiresAt: null,

      setUser: (user) => set({ user }),

      setTokens: async (response) => {
        try {
          // Log the entire response for debugging
          console.log("Authentication response:", response);

          // Destructure the response and ensure necessary fields are available
          const { user, token, refreshToken, expiresIn } = response;

          // Check if response contains all required fields
          if (!user) {
            throw new Error("Missing 'user' in the response.");
          }
          if (!user.username) {
            throw new Error("Missing 'username' in the user object.");
          }
          if (!user.name) {
            throw new Error("Missing 'name' in the user object.");
          }
          if (!user.id) {
            throw new Error("Missing 'id' in the user object.");
          }
          if (!user.email) {
            throw new Error("Missing 'email' in the user object.");
          }
          if (!user.role) {
            throw new Error("Missing 'role' in the user object.");
          }
          if (!token) {
            throw new Error("Missing 'token' in the response.");
          }
          if (!refreshToken) {
            throw new Error("Missing 'refreshToken' in the response.");
          }
          if (!expiresIn) {
            throw new Error("Missing 'expiresIn' in the response.");
          }

          console.log("Setting tokens:", { user, token, refreshToken, expiresIn });

          // Update the state with the received data
          set({
            user: {
              progress: user.progress,
              username: user.username,
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              userLevel: user.userLevel,
              childName: user.childName,
              childGrade: user.childGrade,
            },
            accessToken: token,
            refreshToken,
            tokenExpiresAt: Date.now() + expiresIn * 1000,
            isAuthenticated: true,
            error: null
          });

          // Prepare auth data to be encrypted and stored
          const authData = JSON.stringify({
            user: {
              progress: user.progress,
              username: user.username,
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              userLevel: user.userLevel,
              childName: user.childName,
              childGrade: user.childGrade,
            },
            token,
            refreshToken,
            expiresIn
          });

          // Encrypt and store in sessionStorage
          try {
            const encrypted = await encrypt(authData);
            sessionStorage.setItem('auth-storage', encrypted);
            console.log("Encrypted auth data:", encrypted);
          } catch (err) {
            // Handle the 'unknown' type of err
            if (err instanceof Error) {
              console.error("Error encrypting auth data:", err.message);
              set({ error: `Failed to encrypt auth data: ${err.message}. Please try again later.` });
            } else {
              console.error("Unknown error encrypting auth data:", err);
              set({ error: 'Failed to encrypt auth data. Please try again later.' });
            }
          }

        } catch (err) {
          // Handle the 'unknown' type of err
          if (err instanceof Error) {
            console.error('Error setting tokens:', err.message);
            set({ error: `Failed to set authentication tokens: ${err.message}. Please check the server response and try again.` });
          } else {
            console.error('Unknown error setting tokens:', err);
            set({ error: 'Failed to set authentication tokens. Please check the server response and try again.' });
          }
        }
      },

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
      },

      setError: (error) => set({ error }),

      validateToken: () => {
        const { tokenExpiresAt } = get();
        if (!tokenExpiresAt) return false;

        const isTokenValid = Date.now() < tokenExpiresAt;
        set({ isAuthenticated: isTokenValid });

        if (!isTokenValid) {
          get().clearAuth();
        }

        return isTokenValid;
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: async (key) => {
          try {
            const encryptedValue = sessionStorage.getItem(key);
            if (!encryptedValue) return null;

            const decrypted = await decrypt(encryptedValue);
            console.log("Decrypted auth data:", decrypted);
            return decrypted;
          } catch (err) {
            // Handle the 'unknown' type of err
            if (err instanceof Error) {
              console.error('Error decrypting storage item:', err.message);
            } else {
              console.error('Unknown error decrypting storage item:', err);
            }
            return null;
          }
        },
        setItem: async (key, value) => {
          try {
            const encryptedValue = await encrypt(value);
            sessionStorage.setItem(key, encryptedValue);
            console.log("Stored encrypted value:", encryptedValue);
          } catch (err) {
            // Handle the 'unknown' type of err
            if (err instanceof Error) {
              console.error('Error encrypting storage item:', err.message);
            } else {
              console.error('Unknown error encrypting storage item:', err);
            }
          }
        },
        removeItem: (key) => {
          sessionStorage.removeItem(key);
        }
      }))
    }
  )
);
