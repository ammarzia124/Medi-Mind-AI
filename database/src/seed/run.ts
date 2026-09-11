import fs from 'fs';
import path from 'path';
import { db } from '../client';
import { logger } from '../utils/logger';

/**
 * Seed Runner
 * 
 * Loads sample data into the database for development.
 */
export class SeedRunner {
  private seedDir: string;

  constructor() {
    this.seedDir = path.join(__dirname, '../../seed');
  }

  /**
   * Run all seed files
   */
  async run(): Promise<void> {
    logger.info('Starting seed process...');

    // Get list of seed files
    const files = fs.readdirSync(this.seedDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Apply seeds
    for (const file of files) {
      const seedName = path.basename(file, '.sql');
      logger.info(`Running seed: ${seedName}`);
      
      const filePath = path.join(this.seedDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      try {
        await db.query(sql);
        logger.info(`Successfully ran seed: ${seedName}`);
      } catch (error) {
        logger.error(`Failed to run seed: ${seedName}`, { error });
        throw error;
      }
    }

    logger.info('All seeds completed successfully');
  }
}

// Run seeds if this file is executed directly
if (require.main === module) {
  const runner = new SeedRunner();
  runner.run()
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error('Seed failed', { error });
      process.exit(1);
    });
}

export const seedRunner = new SeedRunner();
