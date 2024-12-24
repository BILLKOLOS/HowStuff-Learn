export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LecturerLogin extends LoginCredentials {
    uniqueCode: string; // Lecturer login based on the unique code
}

export const USER_LEVELS = {
    KINDERGARTEN: 'Kindergarten',
    PRIMARY: 'Primary',
    JUNIOR_SECONDARY: 'Junior Secondary',
    HIGH_SCHOOL: 'High School',
    COLLEGE: 'College',
    UNIVERSITY: 'University',
    SPECIALIZED: 'Specialized Education',
} as const;

export interface RegisterCredentials extends LoginCredentials {
    username: string;
    confirmPassword?: string;
    role: 'user' | 'parent';
    userLevel?: typeof USER_LEVELS[keyof typeof USER_LEVELS];
    childName?: string;
    childGrade?: string;
}

export interface User {
    progress: number;
    username: any;
    id: string;
    name: string;
    email: string;
    role: string;
    userLevel?: string;
    childName?: string;
    childGrade?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
    expiresIn: number;
}
