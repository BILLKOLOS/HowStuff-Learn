export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: User;
  students: User[];
}

export interface VirtualLecture {
  id: string;
  courseId: string;
  title: string;
  startTime: Date;
  duration: number;
  instructor: User;
}

export interface Assessment {
  id: string;
  courseId: string;
  title: string;
  dueDate: Date;
  totalPoints: number;
}
