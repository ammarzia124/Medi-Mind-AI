import { generateToken, verifyToken } from '../src/security/jwt';
import { encrypt, decrypt } from '../src/security/encryption';
import { sanitizeInput, isSQLInjection } from '../src/security/sanitize';

describe('Security Utilities', () => {
  describe('JWT', () => {
    it('should generate and verify token', () => {
      const payload = { userId: 'test-id', email: 'test@example.com' };
      const token = generateToken(payload);
      
      expect(token).toBeDefined();
      
      const decoded = verifyToken(token);
      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe('test-id');
      expect(decoded?.email).toBe('test@example.com');
    });

    it('should return null for invalid token', () => {
      const decoded = verifyToken('invalid-token');
      expect(decoded).toBeNull();
    });
  });

  describe('Encryption', () => {
    it('should encrypt and decrypt data', () => {
      const data = 'sensitive health data';
      const encrypted = encrypt(data);
      
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(data);
      
      const decrypted = decrypt(encrypted);
      expect(decrypted).toBe(data);
    });
  });

  describe('Sanitization', () => {
    it('should sanitize HTML input', () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = sanitizeInput(input);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;script&gt;');
    });

    it('should detect SQL injection', () => {
      expect(isSQLInjection('SELECT * FROM users')).toBe(true);
      expect(isSQLInjection('DROP TABLE users')).toBe(true);
      expect(isSQLInjection('normal text')).toBe(false);
    });
  });
});
