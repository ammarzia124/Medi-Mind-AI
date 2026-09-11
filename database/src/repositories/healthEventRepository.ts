import { db } from '../client';
import { HealthEvent, CreateHealthEventInput, UpdateHealthEventInput, PaginatedResult, PaginationOptions, FilterOptions } from '../types';
import { logger } from '../utils/logger';

/**
 * Health Event Repository
 * 
 * Data access layer for health event operations.
 */
export class HealthEventRepository {
  /**
   * Create a new health event
   */
  async create(input: CreateHealthEventInput): Promise<HealthEvent> {
    const query = `
      INSERT INTO health_events (
        user_id, event_type, title, description, event_date, severity,
        related_consultation_id, related_lab_report_id, related_medication_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      input.user_id,
      input.event_type,
      input.title,
      input.description || null,
      input.event_date,
      input.severity || null,
      input.related_consultation_id || null,
      input.related_lab_report_id || null,
      input.related_medication_id || null,
    ];

    const result = await db.query<HealthEvent>(query, values);
    logger.info('Health event created', { eventId: result.rows[0].id });
    return result.rows[0];
  }

  /**
   * Find health event by ID
   */
  async findById(id: string): Promise<HealthEvent | null> {
    const query = 'SELECT * FROM health_events WHERE id = $1';
    const result = await db.query<HealthEvent>(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * List health events by user with pagination and filters
   */
  async listByUser(
    userId: string, 
    options: PaginationOptions & FilterOptions = {}
  ): Promise<PaginatedResult<HealthEvent>> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    const conditions: string[] = ['user_id = $1'];
    const values: any[] = [userId];
    let paramIndex = 2;

    if (options.type) {
      conditions.push(`event_type = $${paramIndex++}`);
      values.push(options.type);
    }
    if (options.severity) {
      conditions.push(`severity = $${paramIndex++}`);
      values.push(options.severity);
    }
    if (options.startDate) {
      conditions.push(`event_date >= $${paramIndex++}`);
      values.push(options.startDate);
    }
    if (options.endDate) {
      conditions.push(`event_date <= $${paramIndex++}`);
      values.push(options.endDate);
    }

    const whereClause = conditions.join(' AND ');

    const countQuery = `SELECT COUNT(*) FROM health_events WHERE ${whereClause}`;
    const countResult = await db.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count, 10);

    const query = `
      SELECT * FROM health_events
      WHERE ${whereClause}
      ORDER BY event_date DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `;
    values.push(limit, offset);

    const result = await db.query<HealthEvent>(query, values);

    return {
      items: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update health event
   */
  async update(id: string, input: UpdateHealthEventInput): Promise<HealthEvent | null> {
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
    if (input.event_date !== undefined) {
      fields.push(`event_date = $${paramIndex++}`);
      values.push(input.event_date);
    }
    if (input.severity !== undefined) {
      fields.push(`severity = $${paramIndex++}`);
      values.push(input.severity);
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE health_events
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query<HealthEvent>(query, values);
    logger.info('Health event updated', { eventId: id });
    return result.rows[0] || null;
  }

  /**
   * Delete health event
   */
  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM health_events WHERE id = $1';
    const result = await db.query(query, [id]);
    logger.info('Health event deleted', { eventId: id });
    return (result.rowCount || 0) > 0;
  }
}

export const healthEventRepository = new HealthEventRepository();
