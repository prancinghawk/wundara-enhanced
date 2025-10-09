import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv();

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("3001"),
  DATABASE_URL: z.string().url(),
  CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1),
  // Updated to Claude 3.5 Sonnet (latest version as of Oct 2024)
  // Alternative: "claude-3-5-haiku-20241022" for faster/cheaper responses
  ANTHROPIC_MODEL: z.string().default("claude-3-5-sonnet-20241022"),
});

export const env = EnvSchema.parse(process.env);
