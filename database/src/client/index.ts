import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { poolConfig } from '../config';
import { logger } from '../utils/logger';

/**
 * Database Client
 * 
 * Provides connection pooling and query execution for PostgreSQL.
 * Implements singleton pattern for connection reuse.
 */
export class DatabaseClient {
  private pool: Pool;
  private static instance: DatabaseClient;

  private constructor() {
    this.pool = new Pool(poolConfig);

    // Log connection events
    this.pool.on('connect', () => {
      logger.info('Database client connected');
    });

    this.pool.on('error', (err) => {
      logger.error('Database pool error', { error: err.message });
    });
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  /**
   * Execute a query with parameters
   */
  public async query<T extends QueryResultRow = any>(
    text: string,
    params?: any[]
  ): Promise<QueryResult<T>> {
    const start = Date.now();
    try {
      const result = await this.pool.query<T>(text, params);
      const duration = Date.now() - start;
      logger.debug('Query executed', { 
        duration, 
        rows: result.rowCount,
        text: text.substring(0, 100) 
      });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error('Query failed', { 
        duration, 
        error: error instanceof Error ? error.message : 'Unknown error',
        text: text.substring(0, 100)
      });
      throw error;
    }
  }

  /**
   * Get a client from the pool for transactions
   */
  public async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  /**
   * Execute a transaction
   */
  public async transaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Check database connection
   */
  public async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Close all connections
   */
  public async close(): Promise<void> {
    await this.pool.end();
    logger.info('Database pool closed');
  }

  /**
   * Get pool statistics
   */
  public getPoolStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}

// Export singleton instance
export const db = DatabaseClient.getInstance();
