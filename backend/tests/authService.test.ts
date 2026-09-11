import { authService } from '../src/services/authService';

describe('AuthService', () => {
  describe('register', () => {
    it('should register a new user', async () => {
      const result = await authService.register({
        email: 'test@example.com',
        password: 'Password123',
        fullName: 'Test User',
      });

      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const result = await authService.login({
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
    });
  });

  describe('getProfile', () => {
    it('should get user profile', async () => {
      const result = await authService.getProfile('test-user-id');

      expect(result).toBeDefined();
      expect(result.id).toBe('test-user-id');
    });
  });
});
