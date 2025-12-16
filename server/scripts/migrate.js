const db = require('../src/models/database');
const fs = require('fs');
const path = require('path');
const logger = require('../src/utils/logger');

async function runMigrations() {
  try {
    logger.info('Starting database migrations...');

    // Create migrations tracking table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    logger.info('Schema migrations table ready');

    // Get all migration files from database directory
    const migrationsDir = path.join(__dirname, '../../database');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort(); // Run in alphabetical order

    logger.info(`Found ${files.length} migration files`);

    let executed = 0;
    let skipped = 0;

    for (const file of files) {
      // Check if this migration has already been run
      const result = await db.query(
        'SELECT * FROM schema_migrations WHERE filename = $1',
        [file]
      );

      if (result.rows.length === 0) {
        logger.info(`Running migration: ${file}`);

        // Read and execute the migration SQL
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await db.query(sql);

        // Record that this migration has been run
        await db.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1)',
          [file]
        );

        logger.info(`✅ Completed: ${file}`);
        executed++;
      } else {
        logger.info(`⏭️  Skipped (already run): ${file}`);
        skipped++;
      }
    }

    logger.info(`Migration summary: ${executed} executed, ${skipped} skipped`);
    logger.info('All migrations completed successfully');

    return { executed, skipped, total: files.length };
  } catch (error) {
    logger.error('Migration failed', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

// Run migrations if this script is executed directly
if (require.main === module) {
  runMigrations()
    .then(({ executed, skipped, total }) => {
      console.log('\n✅ Migration complete!');
      console.log(`   Executed: ${executed}`);
      console.log(`   Skipped: ${skipped}`);
      console.log(`   Total: ${total}\n`);
      process.exit(0);
    })
    .catch(err => {
      console.error('\n❌ Migration failed:', err.message);
      process.exit(1);
    });
}

// Export for programmatic use
module.exports = { runMigrations };
