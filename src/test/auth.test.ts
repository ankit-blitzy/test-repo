import { describe, it, expect, beforeEach, vi } from 'vitest';
import { register, login } from '../services/auth';

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await register(userData);

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.name).toBe(userData.name);
      expect(result.user.email).toBe(userData.email);
      expect(result.user.id).toBeDefined();
    });

    it('should throw error if email is already registered', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123',
      };

      await register(userData);

      await expect(register(userData)).rejects.toThrow('Email already registered');
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const userData = {
        name: 'Login Test',
        email: 'login@example.com',
        password: 'password123',
      };

      await register(userData);

      const result = await login({
        email: userData.email,
        password: userData.password,
      });

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(userData.email);
    });

    it('should throw error with invalid credentials', async () => {
      await expect(
        login({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid email or password');
    });
  });
});
