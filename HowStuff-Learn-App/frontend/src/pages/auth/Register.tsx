import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { RegisterCredentials, USER_LEVELS } from '@/types/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoaderIcon } from 'lucide-react';
import { z } from 'zod';

const hasDigit = /\d/;
const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

const registerSchema = z
  .object({
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Invalid email').min(1, 'Email is required'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .refine((password) => hasDigit.test(password), {
        message: 'Password must contain at least one digit',
      })
      .refine((password) => hasSpecialChar.test(password), {
        message: 'Password must contain at least one special character',
      }),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['user', 'parent'], { required_error: 'Role is required' }),
    userLevel: z.string().optional(),
    childName: z.string().optional(),
    childGrade: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords must match',
      });
    }

    if (data.role === 'user' && !data.userLevel) {
      ctx.addIssue({
        code: 'custom',
        path: ['userLevel'],
        message: 'User level is required for users',
      });
    }

    if (data.role === 'parent') {
      if (!data.childName) {
        ctx.addIssue({
          code: 'custom',
          path: ['childName'],
          message: "Child's name is required for parents",
        });
      }
      if (!data.childGrade) {
        ctx.addIssue({
          code: 'custom',
          path: ['childGrade'],
          message: "Child's grade is required for parents",
        });
      }
    }
  });

type RegisterFormData = RegisterCredentials & {
  confirmPassword: string;
};

const Register: React.FC = () => {
  const { register } = useAuth();
  const { register: registerField, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'user',
    },
  });

  const role = watch('role');


  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registrationData } = data;
    const res = register.mutate(registrationData);
    localStorage.removeItem('registerFormData');
    console.log(res);
  };

  const handleRoleChange = (value: typeof role) => {
    setValue('role', value);
  };

  const handleUserLevelChange = (value: string) => {
    setValue('userLevel', value as RegisterFormData['userLevel']);
  };

  useEffect(() => {
    const savedData = localStorage.getItem('registerFormData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      reset({
        ...parsedData,
        password: '',
        confirmPassword: '',
      });
    }
  }, [reset]);

  useEffect(() => {
    const subscription = watch((data) => {
      if (data) {
        const { password, confirmPassword, ...dataToStore } = data as RegisterFormData;
        localStorage.setItem('registerFormData', JSON.stringify(dataToStore));
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="container mx-auto px-4 py-2">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Create a new account</CardTitle>
          <CardDescription className="pt-3">
            Or{' '}
            <Link to="/login" className="text-primary hover:underline">
              sign in to your existing account
            </Link>
          </CardDescription>
        </CardHeader>

        <CardContent>
          {register.isError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {register.isError ? String(register.failureReason) : 'Registration failed'}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="username" className="font-bold">Username</Label>
              <Input {...registerField('username')} id="username" placeholder="John Doe" />
              {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="email" className="font-bold">Email address</Label>
              <Input {...registerField('email')} id="email" type="email" placeholder="you@example.com" />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2 col-span-1">
              <Label htmlFor="password" className="font-bold">Password</Label>
              <Input {...registerField('password')} id="password" type="password" />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-2 col-span-1">
              <Label htmlFor="confirmPassword" className="font-bold">Confirm password</Label>
              <Input {...registerField('confirmPassword')} id="confirmPassword" type="password" />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label className="font-bold">Role</Label>
              <RadioGroup defaultValue="user" onValueChange={handleRoleChange} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user">User</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="parent" id="parent" />
                  <Label htmlFor="parent">Parent</Label>
                </div>
              </RadioGroup>
              {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
            </div>

            {role === 'user' && (
              <div className="space-y-2 col-span-2">
                <Label htmlFor="userLevel" className="font-bold">User Level</Label>
                <Select onValueChange={handleUserLevelChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select User Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(USER_LEVELS).map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.userLevel && <p className="text-sm text-destructive">{errors.userLevel.message}</p>}
              </div>
            )}

            {role === 'parent' && (
              <>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="childName" className="font-bold">Child's Name</Label>
                  <Input {...registerField('childName')} id="childName" />
                  {errors.childName && <p className="text-sm text-destructive">{errors.childName.message}</p>}
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="childGrade" className="font-bold">Child's Grade</Label>
                  <Input {...registerField('childGrade')} id="childGrade" />
                  {errors.childGrade && <p className="text-sm text-destructive">{errors.childGrade.message}</p>}
                </div>
              </>
            )}

            <Button type="submit" disabled={register.isPending} className="w-full col-span-2">
              {register.isPending ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
