import React, { useState } from 'react';
import { useForm, SubmitHandler, FieldErrors } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/slices/authSlice';
import type { LoginCredentials, LecturerLogin } from '@/types/auth';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Login: React.FC = () => {
    const { login, lecturerLogin } = useAuth(); // Include lecturer login
    const error = useAuthStore((state) => state.error);
    const setTokens = useAuthStore((state) => state.setTokens); // Get setTokens function from the store
    const [isLecturer, setIsLecturer] = useState(false);

    // Define the correct form type based on `isLecturer`
    const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginCredentials | LecturerLogin>();

    // Type guard to determine if errors belong to LecturerLogin
    const isLecturerErrors = (errors: FieldErrors<LoginCredentials> | FieldErrors<LecturerLogin>): errors is FieldErrors<LecturerLogin> => {
        return 'uniqueCode' in errors;
    };

    // Submit handler to differentiate between user and lecturer login
    const onSubmit: SubmitHandler<LoginCredentials | LecturerLogin> = (data) => {
        if (isLecturer) {
            lecturerLogin.mutate(data as LecturerLogin, {
                onSuccess: async (response) => {
                    console.log('Lecturer login response:', response);

                    await setTokens(response);
                    
                    window.location.href = response.redirectUrl || '/lecturer-dashboard';
                },
                onError: (error) => {
                    console.error('Lecturer login error:', error);
                    // Display error to user or set state
                },
            });
        } else {
            login.mutate(data as LoginCredentials, {
                onSuccess: async (response) => {
                    console.log('User login response:', response);

                    await setTokens(response);

                    window.location.href = response.redirectUrl || '/dashboard';
                },
                onError: (error) => {
                    console.error('User login error:', error);
                    // Display error to user or set state
                },
            });
        }
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

                    <div className="space-y-4">
                        <Button
                            variant={isLecturer ? 'secondary' : 'outline'}
                            className="w-full"
                            onClick={() => {
                                setIsLecturer(false);
                                reset(); // Reset form when switching
                            }}
                        >
                            Login as User
                        </Button>
                        <Button
                            variant={isLecturer ? 'outline' : 'secondary'}
                            className="w-full"
                            onClick={() => {
                                setIsLecturer(true);
                                reset(); // Reset form when switching
                            }}
                        >
                            Login as Lecturer
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
                        {isLecturer ? (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="uniqueCode">Unique Code</Label>
                                    <Input
                                        {...register('uniqueCode', {
                                            required: 'Unique code is required',
                                        })}
                                        type="text"
                                        placeholder="Enter your unique code"
                                    />
                                    {isLecturerErrors(errors) && errors.uniqueCode && (
                                        <p className="text-sm text-status-error">
                                            {errors.uniqueCode?.message}
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
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
                                        <p className="text-sm text-status-error">
                                            {errors.email?.message}
                                        </p>
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
                                        <p className="text-sm text-status-error">
                                            {errors.password?.message}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        <Button
                            type="submit"
                            disabled={login.isPending || lecturerLogin.isPending}
                            className="w-full"
                        >
                            {(login.isPending || lecturerLogin.isPending) ? (
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
