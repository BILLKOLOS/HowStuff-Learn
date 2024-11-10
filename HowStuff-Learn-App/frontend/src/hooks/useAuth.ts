import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { authApi } from '@/lib/api-client';
import { useAuthStore } from '@/store/slices/authSlice';

export function useAuth() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { setTokens, clearAuth, setError } = useAuthStore();

    const login = useMutation({
        mutationFn: authApi.login,
        onSuccess: (response) => {
            setTokens(response);
            navigate(response.redirectUrl || '/dashboard');
            toast({
                variant: "success",
                title: "Success!",
                description: "You've been successfully logged in.",
                duration: 3000,
            });
        },
        onError: (error: Error) => {
            setError(error.message);
            toast({
                variant: "destructive",
                title: 'Login failed!',
                description: error.message,
                duration: 5000,
            });
        }
    });

    const register = useMutation({
        mutationFn: authApi.register,
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Registration successful!",
                description: "Please log in with your new account.",
                duration: 3000,
            });
            navigate('/login');
        },
        onError: (error: Error) => {
            setError(error.message);
            toast({
                variant: "destructive",
                title: 'Registration failed!',
                description: error.message,
                duration: 5000,
            });
        }
    });

    const logout = () => {
        clearAuth();
        navigate('/login');
        toast({
            variant: "info",
            title: "Logged out",
            description: "You've been successfully logged out.",
            duration: 3000,
        });
    };

    return { login, register, logout };
}
