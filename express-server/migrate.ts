import { config } from 'dotenv';

// Load environment variables first
config({ path: process.env.NODE_ENV === 'production' ? '.prod.env' : '.dev.env' });

import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

// Debugging output
console.log(`Running in ${process.env.NODE_ENV || 'development'} mode.`);

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables.');
}

const databaseUrl = drizzle(postgres(DATABASE_URL, { ssl: 'require', max: 1 }));

const main = async () => {
  try {
    await migrate(databaseUrl, { migrationsFolder: 'drizzle' });
    console.log('Migration complete');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
};

main();
