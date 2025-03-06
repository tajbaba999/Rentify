// import { config } from "dotenv";
// import type { Config } from "drizzle-kit";

// config();

// console.log("DATABASE_URL:", process.env.DATABASE_URL);

// export default {
//   schema: "./src/db/schema.ts",
//   out: "./drizzle/migrations",
//   driver: "pg",
//   dialect : "postgresql",
//   dbCredentials: {
//     connectionString: "postgresql://neondb_owner:SlD61IGmXYcb@ep-jolly-flower-a5k2enom-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
//   },
// } satisfies Config;
import { config } from "dotenv";
import type { Config } from "drizzle-kit";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

config();

// Use alternative variable names to avoid conflicts
const currentFile = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFile);

export default {
  schema: resolve(currentDir, "./src/db/schema.ts"), // Absolute path to your schema file
  out: resolve(currentDir, "./src/db/migrations"),     // Absolute path for migrations output
  dialect: "postgresql", // Exactly "pg" for PostgreSQL
  dbCredentials: {
    host: "host",
    port: 5432,
    user: "neonddb_owner",
    password: "SlD61IGmXYcb",
    database: "neondb",
    ssl: true,
  },
} satisfies Config;



