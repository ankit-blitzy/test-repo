import type { User, LoginCredentials, RegisterData } from '../types';

const STORAGE_KEY = 'burger_house_user';

// Mock user data
const mockUsers: Map<string, { user: User; password: string }> = new Map();

export async function login(credentials: LoginCredentials): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const userData = mockUsers.get(credentials.email);
  if (userData && userData.password === credentials.password) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData.user));
    return userData.user;
  }
  
  throw new Error('Invalid email or password');
}

export async function register(data: RegisterData): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (mockUsers.has(data.email)) {
    throw new Error('Email already registered');
  }
  
  const user: User = {
    id: `user_${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    createdAt: new Date(),
  };
  
  mockUsers.set(data.email, { user, password: data.password });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export async function logout(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser(): User | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
}
