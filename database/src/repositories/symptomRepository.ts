import { db } from '../client';
import { Symptom, CreateSymptomInput, UpdateSymptomInput, PaginatedResult, PaginationOptions } from '../types';
import { logger } from '../utils/logger';

/**
 * Symptom Repository
 * 
 * Data access layer for symptom operations.
 */
export class SymptomRepository {
  /**
   * Create a new symptom
   */
  async create(input: CreateSymptomInput): Promise<Symptom> {
    const query = `
      INSERT INTO symptoms (user_id, title, description, severity, onset_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      input.user_id,
      input.title,
      input.description || null,
      input.severity || null,
      input.onset_date || new Date(),
    ];

    const result = await db.query<Symptom>(query, values);
    logger.info('Symptom created', { symptomId: result.rows[0].id });
    return result.rows[0];
  }

  /**
   * Find symptom by ID (with user authorization)
   */
  async findById(id: string, userId: string): Promise<Symptom | null> {
    const query = 'SELECT * FROM symptoms WHERE id = $1 AND user_id = $2';
    const result = await db.query<Symptom>(query, [id, userId]);
    return result.rows[0] || null;
  }

  /**
   * List symptoms by user with pagination
   */
  async listByUser(
    userId: string, 
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<Symptom>> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT(*) FROM symptoms WHERE user_id = $1';
    const countResult = await db.query(countQuery, [userId]);
    const total = parseInt(countResult.rows[0].count, 10);

    const query = `
      SELECT * FROM symptoms
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await db.query<Symptom>(query, [userId, limit, offset]);

    return {
      items: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update symptom (with user authorization)
   */
  async update(id: string, userId: string, input: UpdateSymptomInput): Promise<Symptom | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(input.title);
    }
    if (input.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(input.description);
    }
    if (input.severity !== undefined) {
      fields.push(`severity = $${paramIndex++}`);
      values.push(input.severity);
    }
    if (input.resolved_date !== undefined) {
      fields.push(`resolved_date = $${paramIndex++}`);
      values.push(input.resolved_date);
    }
    if (input.is_active !== undefined) {
      fields.push(`is_active = $${paramIndex++}`);
      values.push(input.is_active);
    }

    if (fields.length === 0) {
      return await this.findById(id, userId);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id, userId);

    const query = `
      UPDATE symptoms
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await db.query<Symptom>(query, values);
    logger.info('Symptom updated', { symptomId: id, userId });
    return result.rows[0] || null;
  }

  /**
   * Delete symptom (with user authorization)
   */
  async delete(id: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM symptoms WHERE id = $1 AND user_id = $2';
    const result = await db.query(query, [id, userId]);
    logger.info('Symptom deleted', { symptomId: id, userId });
    return (result.rowCount || 0) > 0;
  }
}

export const symptomRepository = new SymptomRepository();
