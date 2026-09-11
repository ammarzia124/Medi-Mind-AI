import { db } from '../client';
import { Consultation, CreateConsultationInput, PaginatedResult, PaginationOptions, FilterOptions } from '../types';
import { logger } from '../utils/logger';

/**
 * Consultation Repository
 * 
 * Data access layer for consultation operations.
 */
export class ConsultationRepository {
  /**
   * Create a new consultation
   */
  async create(input: CreateConsultationInput): Promise<Consultation> {
    const query = `
      INSERT INTO consultations (user_id, type, user_input, ai_response, severity_level, care_navigation)
      VALUES ($1, $2, $3, $4, $6, $6)
      RETURNING *
    `;
    const values = [
      input.user_id,
      input.type,
      input.user_input,
      JSON.stringify(input.ai_response),
      input.severity_level || null,
      input.care_navigation || null,
    ];

    const result = await db.query<Consultation>(query, values);
    logger.info('Consultation created', { consultationId: result.rows[0].id });
    return result.rows[0];
  }

  /**
   * Find consultation by ID
   */
  async findById(id: string): Promise<Consultation | null> {
    const query = 'SELECT * FROM consultations WHERE id = $1';
    const result = await db.query<Consultation>(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * List consultations by user with pagination and filters
   */
  async listByUser(
    userId: string, 
    options: PaginationOptions & FilterOptions = {}
  ): Promise<PaginatedResult<Consultation>> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    const conditions: string[] = ['user_id = $1'];
    const values: any[] = [userId];
    let paramIndex = 2;

    if (options.type) {
      conditions.push(`type = $${paramIndex++}`);
      values.push(options.type);
    }
    if (options.startDate) {
      conditions.push(`created_at >= $${paramIndex++}`);
      values.push(options.startDate);
    }
    if (options.endDate) {
      conditions.push(`created_at <= $${paramIndex++}`);
      values.push(options.endDate);
    }

    const whereClause = conditions.join(' AND ');

    const countQuery = `SELECT COUNT(*) FROM consultations WHERE ${whereClause}`;
    const countResult = await db.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count, 10);

    const query = `
      SELECT * FROM consultations
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `;
    values.push(limit, offset);

    const result = await db.query<Consultation>(query, values);

    return {
      items: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Delete consultation
   */
  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM consultations WHERE id = $1';
    const result = await db.query(query, [id]);
    logger.info('Consultation deleted', { consultationId: id });
    return (result.rowCount || 0) > 0;
  }
}

export const consultationRepository = new ConsultationRepository();
