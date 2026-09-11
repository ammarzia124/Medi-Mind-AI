import bcrypt from 'bcryptjs';
import { generateToken } from '../security/jwt';
import { config } from '../config';

interface RegisterData {
  email: string;
  password: string;
  fullName?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  languagePreference: string;
}

export class AuthService {
  async register(data: RegisterData): Promise<{ token: string; user: UserProfile }> {
    // Check if user already exists
    // TODO: Implement database check
    // const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [data.email]);
    // if (existingUser.rows.length > 0) {
    //   throw new Error('User already exists');
    // }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, config.security.bcryptRounds);

    // Create user
    // TODO: Implement database insert
    // const result = await db.query(
    //   'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name, language_preference',
    //   [data.email, passwordHash, data.fullName]
    // );
    
    // Mock user for now
    const user: UserProfile = {
      id: 'mock-user-id',
      email: data.email,
      fullName: data.fullName || null,
      languagePreference: 'en',
    };

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return { token, user };
  }

  async login(data: LoginData): Promise<{ token: string; user: UserProfile }> {
    // Find user
    // TODO: Implement database query
    // const result = await db.query('SELECT * FROM users WHERE email = $1', [data.email]);
    // if (result.rows.length === 0) {
    //   throw new Error('Invalid credentials');
    // }
    // const user = result.rows[0];

    // Mock user for now
    const user: UserProfile = {
      id: 'mock-user-id',
      email: data.email,
      fullName: 'Mock User',
      languagePreference: 'en',
    };

    // Verify password
    // TODO: Implement password verification
    // const isValid = await bcrypt.compare(data.password, user.password_hash);
    // if (!isValid) {
    //   throw new Error('Invalid credentials');
    // }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return { token, user };
  }

  async getProfile(userId: string): Promise<UserProfile> {
    // TODO: Fetch from database
    // const result = await db.query('SELECT id, email, full_name, language_preference FROM users WHERE id = $1', [userId]);
    // if (result.rows.length === 0) {
    //   throw new Error('User not found');
    // }
    // return result.rows[0];

    // Mock for now
    return {
      id: userId,
      email: 'user@example.com',
      fullName: 'Mock User',
      languagePreference: 'en',
    };
  }

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    // TODO: Update in database
    // await db.query(
    //   'UPDATE users SET full_name = $1, language_preference = $2 WHERE id = $3',
    //   [data.fullName, data.languagePreference, userId]
    // );

    // Mock for now
    return {
      id: userId,
      email: 'user@example.com',
      fullName: data.fullName || 'Updated User',
      languagePreference: data.languagePreference || 'en',
    };
  }
}

export const authService = new AuthService();
