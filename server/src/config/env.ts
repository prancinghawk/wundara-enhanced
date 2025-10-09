import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv();

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("3001"),
  DATABASE_URL: z.string().url(),
  // Clerk keys are optional (not used with Stack Auth)
  CLERK_PUBLISHABLE_KEY: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().min(1),
  // Updated to Claude 3.5 Sonnet (latest version as of Oct 2024)
  // Alternative: "claude-3-5-haiku-20241022" for faster/cheaper responses
  ANTHROPIC_MODEL: z.string().default("claude-3-5-sonnet-20241022"),
  // Stack Auth (Neon Auth)
  STACK_PROJECT_ID: z.string().optional(),
  STACK_SECRET_SERVER_KEY: z.string().optional(),
});

export const env = EnvSchema.parse(process.env);
