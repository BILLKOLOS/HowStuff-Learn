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
  lecturerLogin: (uniqueCode: string) => Promise<void>; // Lecturer login mutation
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
          console.log("Authentication response received:", response);

          if (!response) {
            throw new Error("Received undefined response from the authentication API.");
          }

          const { user, token, refreshToken, expiresIn } = response;

          console.log("User data:", user);
          console.log("Token:", token);
          console.log("Refresh Token:", refreshToken);
          console.log("Expires In:", expiresIn);

          if (!user) {
            throw new Error("Missing 'user' in the response.");
          }

          if (!token) {
            throw new Error("Missing 'token' in the response.");
          }
          if (!refreshToken) {
            throw new Error("Missing 'refreshToken' in the response.");
          }

          const tokenExpiresIn = expiresIn || 3600;

          console.log("Setting tokens with user data:", {
            user,
            token,
            refreshToken,
            tokenExpiresIn
          });

          // Update the state with the received data
          set({
            user: {
              progress: user.progress,
              username: user.username || user.name,
              id: user.id || "default-id",
              name: user.name || "Unknown",
              email: user.email || "Unknown",
              role: user.role || "user",
              userLevel: user.userLevel,
              childName: user.childName,
              childGrade: user.childGrade,
            },
            accessToken: token,
            refreshToken,
            tokenExpiresAt: Date.now() + tokenExpiresIn * 1000,
            isAuthenticated: true,
            error: null,
          });

          const authData = JSON.stringify({
            user: {
              progress: user.progress,
              username: user.username || user.name,
              id: user.id || "default-id",
              name: user.name || "Unknown",
              email: user.email || "Unknown",
              role: user.role || "user",
              userLevel: user.userLevel,
              childName: user.childName,
              childGrade: user.childGrade,
            },
            accessToken: token,
            refreshToken,
            expiresIn: tokenExpiresIn,
          });

          try {
            const encrypted = await encrypt(authData);
            sessionStorage.setItem('auth-storage', encrypted);
            console.log("Encrypted auth data successfully stored:", encrypted);
          } catch (err) {
            if (err instanceof Error) {
              console.error("Error encrypting auth data:", err.message);
              set({
                error: `Failed to encrypt auth data: ${err.message}. Please try again later.`,
              });
            } else {
              console.error("Unknown error encrypting auth data:", err);
              set({
                error: 'Failed to encrypt auth data. Please try again later.',
              });
            }
          }

        } catch (err) {
          if (err instanceof Error) {
            console.error('Error setting tokens:', err.message);
            set({
              error: `Failed to set authentication tokens: ${err.message}. Please check the server response and try again.`,
            });
          } else {
            console.error('Unknown error setting tokens:', err);
            set({
              error: 'Failed to set authentication tokens. Please check the server response and try again.',
            });
          }
        }
      },

      lecturerLogin: async (uniqueCode: string) => {
        set({ isLoading: true });
        try {
          console.log('Starting lecturer login...');
          const response = await fetch('http://localhost:5000/lecturer/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uniqueCode }),
          });

          console.log('Fetch response:', response);

          if (!response.ok) {
            throw new Error('Lecturer authentication failed: ' + response.statusText);
          }

          const data = await response.json();
          console.log('Parsed JSON data:', data);

          if (!data) {
            throw new Error('No data returned from lecturer authentication API');
          }

          // Adjust the field names to match the expected structure
          const authData = {
            ...data,
            token: data.accessToken, // Ensure 'token' is correctly mapped from 'accessToken'
          };

          console.log('Data before setting tokens:', authData);

          // Set tokens if response is valid
          await get().setTokens(authData);

          // Redirect to the lecturer dashboard
          window.location.href = '/lecturer-dashboard';

        } catch (err) {
          if (err instanceof Error) {
            console.error('Lecturer login error:', err.message);
            set({ error: `Lecturer login failed: ${err.message}. Please try again later.` });
          } else {
            console.error('Unknown error during lecturer login:', err);
            set({ error: 'Lecturer login failed. Please try again later.' });
          }
        } finally {
          set({ isLoading: false });
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
          console.log('Token has expired. Clearing auth...');
          get().clearAuth();
        } else {
          console.log('Token is still valid.');
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
