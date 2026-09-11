import fs from 'fs';
import path from 'path';
import { db } from '../client';
import { logger } from '../utils/logger';

/**
 * Migration Runner
 * 
 * Handles database schema migrations.
 */
export class MigrationRunner {
  private migrationsDir: string;

  constructor() {
    this.migrationsDir = path.join(__dirname, '../../migrations');
  }

  /**
   * Run all pending migrations
   */
  async up(): Promise<void> {
    logger.info('Starting migrations...');

    // Create migrations tracking table if it doesn't exist
    await this.createMigrationsTable();

    // Get list of migration files
    const files = fs.readdirSync(this.migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Get already applied migrations
    const appliedMigrations = await this.getAppliedMigrations();

    // Apply pending migrations
    for (const file of files) {
      const migrationName = path.basename(file, '.sql');
      
      if (appliedMigrations.includes(migrationName)) {
        logger.info(`Skipping already applied migration: ${migrationName}`);
        continue;
      }

      logger.info(`Applying migration: ${migrationName}`);
      
      const filePath = path.join(this.migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      try {
        await db.query(sql);
        await this.recordMigration(migrationName);
        logger.info(`Successfully applied migration: ${migrationName}`);
      } catch (error) {
        logger.error(`Failed to apply migration: ${migrationName}`, { error });
        throw error;
      }
    }

    logger.info('All migrations completed successfully');
  }

  /**
   * Rollback last migration
   */
  async down(): Promise<void> {
    logger.info('Rolling back last migration...');
    
    const appliedMigrations = await this.getAppliedMigrations();
    
    if (appliedMigrations.length === 0) {
      logger.info('No migrations to rollback');
      return;
    }

    const lastMigration = appliedMigrations[appliedMigrations.length - 1];
    logger.info(`Rolling back migration: ${lastMigration}`);

    // Note: In a production system, you would have rollback SQL files
    // For now, we just remove the migration record
    await db.query(
      'DELETE FROM _migrations WHERE name = $1',
      [lastMigration]
    );

    logger.info(`Successfully rolled back migration: ${lastMigration}`);
  }

  /**
   * Create migrations tracking table
   */
  private async createMigrationsTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    await db.query(query);
  }

  /**
   * Get list of applied migrations
   */
  private async getAppliedMigrations(): Promise<string[]> {
    const query = 'SELECT name FROM _migrations ORDER BY applied_at ASC';
    const result = await db.query(query);
    return result.rows.map(row => row.name);
  }

  /**
   * Record a migration as applied
   */
  private async recordMigration(name: string): Promise<void> {
    const query = 'INSERT INTO _migrations (name) VALUES ($1)';
    await db.query(query, [name]);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  const runner = new MigrationRunner();
  const command = process.argv[2];

  if (command === 'down') {
    runner.down()
      .then(() => process.exit(0))
      .catch((error) => {
        logger.error('Migration failed', { error });
        process.exit(1);
      });
  } else {
    runner.up()
      .then(() => process.exit(0))
      .catch((error) => {
        logger.error('Migration failed', { error });
        process.exit(1);
      });
  }
}

export const migrationRunner = new MigrationRunner();
