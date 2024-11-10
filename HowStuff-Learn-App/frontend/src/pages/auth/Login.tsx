import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/slices/authSlice';
import type { LoginCredentials } from '@/types/auth';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Login: React.FC = () => {
    const { login } = useAuth();
    const error = useAuthStore((state) => state.error);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginCredentials>();

    const onSubmit = (data: LoginCredentials) => {
        login.mutate(data);
    };

    return (
        <div className="flex items-center justify-center p-4 w-10/12 min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <h2 className="text-2xl font-semibold">Sign in to your account</h2>
                    <p className="text-sm text-text-secondary pt-3">
                        Or{' '}
                        <Link to="/register" className="text-blue-500 font-medium hover:text-blue-700">
                            create a new account
                        </Link>
                    </p>
                </CardHeader>

                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Please enter a valid email address',
                                    },
                                })}
                                type="email"
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-status-error">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters long',
                                    },
                                })}
                                type="password"
                            />
                            {errors.password && (
                                <p className="text-sm text-status-error">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    // {...register('rememberMe')}
                                    id="remember-me"
                                />
                                <Label htmlFor="remember-me" className="text-sm">
                                    Remember me
                                </Label>
                            </div>
                            <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-black">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            disabled={login.isPending}
                            className="w-full"
                        >
                            {login.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
