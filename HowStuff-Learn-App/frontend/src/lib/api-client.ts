import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config';
import { AuthError, NetworkError } from '@/types/error';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';
import { useAuthStore } from '@/store/slices/authSlice';

const api: AxiosInstance = axios.create({
    baseURL: config.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

async function addAuthTokenToRequest(conf: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    /*skip login and refresh endpoints*/
    const isAuthEndpoint = [
        config.loginEndpoint,
        config.refreshTokenEndpoint
    ].includes(conf.url || '');

    if (!isAuthEndpoint) {
        const token = useAuthStore.getState().accessToken
        if (token && conf.headers) {
            conf.headers.set('Authorization', `Bearer ${token}`);
        }
    }
    return conf;
}

function handleUnauthorizedResponse(error: AxiosError): Promise<never> {
    if (error.response?.status === 401) {
        useAuthStore.getState().clearAuth();
    }
    useAuthStore.setState({error: error.message || 'An error occurred during the request.'});
    return Promise.reject(error);
}

api.interceptors.request.use(addAuthTokenToRequest);
api.interceptors.response.use(
    (response) => response,
    handleUnauthorizedResponse
);

export const authApi = {
    login: async (credentials: LoginCredentials) => {
        try {
            const { data } = await api.post(config.loginEndpoint, credentials);
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new AuthError(error.response.data.message);
            }
            throw new NetworkError('An error occurred during the request.');
        }
    },

    register: async (credentials: RegisterCredentials) => {
        try {
            const response = await api.post(config.registerEndpoint, credentials);
            return response;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new AuthError(error.response.data.message);
            } else {
                throw new NetworkError('An error occurred during the request.');
            }
        }
    },
    verifyToken: async (token: string) => {
        /*Implementation of token verification with  backend needed*/
        const response = await api.post(config.verifyTokenEndpoint, token)
        if (!response.status) throw new Error('Invalid token');
    },
    refreshToken: async (refreshToken: string) => {
        try {
            const { data } = await api.post(config.refreshTokenEndpoint, { refreshToken });
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new AuthError(error.response.data.message);
            }
            throw new NetworkError('An error occurred during the request.');
        }
    },
};
