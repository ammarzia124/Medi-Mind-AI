import { db } from '../client';
import { Medication, CreateMedicationInput, UpdateMedicationInput, PaginatedResult, PaginationOptions } from '../types';
import { logger } from '../utils/logger';

/**
 * Medication Repository
 * 
 * Data access layer for medication operations.
 */
export class MedicationRepository {
  /**
   * Create a new medication
   */
  async create(input: CreateMedicationInput): Promise<Medication> {
    const query = `
      INSERT INTO medications (user_id, name, dosage, frequency, start_date, end_date, reminder_enabled, reminder_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      input.user_id,
      input.name,
      input.dosage || null,
      input.frequency || null,
      input.start_date || new Date(),
      input.end_date || null,
      input.reminder_enabled || false,
      input.reminder_time || null,
    ];

    const result = await db.query<Medication>(query, values);
    logger.info('Medication created', { medicationId: result.rows[0].id });
    return result.rows[0];
  }

  /**
   * Find medication by ID
   */
  async findById(id: string): Promise<Medication | null> {
    const query = 'SELECT * FROM medications WHERE id = $1';
    const result = await db.query<Medication>(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * List medications by user with pagination
   */
  async listByUser(
    userId: string, 
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<Medication>> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT(*) FROM medications WHERE user_id = $1';
    const countResult = await db.query(countQuery, [userId]);
    const total = parseInt(countResult.rows[0].count, 10);

    const query = `
      SELECT * FROM medications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await db.query<Medication>(query, [userId, limit, offset]);

    return {
      items: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * List active medications by user
   */
  async listActiveByUser(userId: string): Promise<Medication[]> {
    const query = `
      SELECT * FROM medications
      WHERE user_id = $1 AND is_active = true
      ORDER BY name ASC
    `;
    const result = await db.query<Medication>(query, [userId]);
    return result.rows;
  }

  /**
   * Update medication
   */
  async update(id: string, input: UpdateMedicationInput): Promise<Medication | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(input.name);
    }
    if (input.dosage !== undefined) {
      fields.push(`dosage = $${paramIndex++}`);
      values.push(input.dosage);
    }
    if (input.frequency !== undefined) {
      fields.push(`frequency = $${paramIndex++}`);
      values.push(input.frequency);
    }
    if (input.end_date !== undefined) {
      fields.push(`end_date = $${paramIndex++}`);
      values.push(input.end_date);
    }
    if (input.is_active !== undefined) {
      fields.push(`is_active = $${paramIndex++}`);
      values.push(input.is_active);
    }
    if (input.reminder_enabled !== undefined) {
      fields.push(`reminder_enabled = $${paramIndex++}`);
      values.push(input.reminder_enabled);
    }
    if (input.reminder_time !== undefined) {
      fields.push(`reminder_time = $${paramIndex++}`);
      values.push(input.reminder_time);
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE medications
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query<Medication>(query, values);
    logger.info('Medication updated', { medicationId: id });
    return result.rows[0] || null;
  }

  /**
   * Delete medication
   */
  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM medications WHERE id = $1';
    const result = await db.query(query, [id]);
    logger.info('Medication deleted', { medicationId: id });
    return (result.rowCount || 0) > 0;
  }
}

export const medicationRepository = new MedicationRepository();
