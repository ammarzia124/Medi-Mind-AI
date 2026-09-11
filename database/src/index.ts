/**
 * MediMind AI Database Layer
 * 
 * Complete database implementation with:
 * - Connection pooling
 * - Repository pattern
 * - Migration system
 * - Seed system
 * - Type-safe queries
 */

// Configuration
export { config, poolConfig } from './config';
export type { DatabaseConfig } from './config';

// Client
export { DatabaseClient, db } from './client';

// Types
export * from './types';

// Repositories
export { UserRepository, userRepository } from './repositories/userRepository';
export { ConsultationRepository, consultationRepository } from './repositories/consultationRepository';
export { SymptomRepository, symptomRepository } from './repositories/symptomRepository';
export { MedicationRepository, medicationRepository } from './repositories/medicationRepository';
export { HealthEventRepository, healthEventRepository } from './repositories/healthEventRepository';

// Migrations
export { MigrationRunner, migrationRunner } from './migrations/run';

// Seeds
export { SeedRunner, seedRunner } from './seed/run';

// Utils
export { logger, LogLevel } from './utils/logger';
