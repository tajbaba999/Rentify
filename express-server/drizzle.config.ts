import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config();

console.log("DATABASE_URL:", process.env.DATABASE_URL);

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: "postgresql://neondb_owner:SlD61IGmXYcb@ep-jolly-flower-a5k2enom-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
  },
} satisfies Config;
