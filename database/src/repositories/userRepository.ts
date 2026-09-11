import { db } from '../client';
import { User, CreateUserInput, UpdateUserInput, PaginatedResult, PaginationOptions } from '../types';
import { logger } from '../utils/logger';

/**
 * User Repository
 * 
 * Data access layer for user operations.
 */
export class UserRepository {
  /**
   * Create a new user
   */
  async create(input: CreateUserInput): Promise<User> {
    const query = `
      INSERT INTO users (email, password_hash, language_preference)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [
      input.email,
      input.password_hash,
      input.language_preference || 'en',
    ];

    const result = await db.query<User>(query, values);
    logger.info('User created', { userId: result.rows[0].id });
    return result.rows[0];
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1 AND is_active = true';
    const result = await db.query<User>(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await db.query<User>(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Update user
   */
  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.email !== undefined) {
      fields.push(`email = $${paramIndex++}`);
      values.push(input.email);
    }
    if (input.language_preference !== undefined) {
      fields.push(`language_preference = $${paramIndex++}`);
      values.push(input.language_preference);
    }
    if (input.last_login_at !== undefined) {
      fields.push(`last_login_at = $${paramIndex++}`);
      values.push(input.last_login_at);
    }
    if (input.is_active !== undefined) {
      fields.push(`is_active = $${paramIndex++}`);
      values.push(input.is_active);
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query<User>(query, values);
    logger.info('User updated', { userId: id });
    return result.rows[0] || null;
  }

  /**
   * Delete user (soft delete)
   */
  async delete(id: string): Promise<boolean> {
    const query = 'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1';
    const result = await db.query(query, [id]);
    logger.info('User deleted', { userId: id });
    return (result.rowCount || 0) > 0;
  }

  /**
   * List users with pagination
   */
  async list(options: PaginationOptions = {}): Promise<PaginatedResult<User>> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT(*) FROM users WHERE is_active = true';
    const countResult = await db.query(countQuery);
    const total = parseInt(countResult.rows[0].count, 10);

    const query = `
      SELECT * FROM users
      WHERE is_active = true
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await db.query<User>(query, [limit, offset]);

    return {
      items: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const userRepository = new UserRepository();
