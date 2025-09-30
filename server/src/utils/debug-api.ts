import { env } from "../config/env";

export function debugApiConfiguration() {
  console.log("\n🔍 API Configuration Debug:");
  console.log("================================");
  
  // Check environment variables
  console.log(`NODE_ENV: ${env.NODE_ENV}`);
  console.log(`PORT: ${env.PORT}`);
  
  // Check Anthropic API key (mask for security)
  const anthropicKey = env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    const maskedKey = anthropicKey.substring(0, 8) + "..." + anthropicKey.substring(anthropicKey.length - 4);
    console.log(`ANTHROPIC_API_KEY: ${maskedKey} (${anthropicKey.length} chars)`);
    console.log(`ANTHROPIC_MODEL: ${env.ANTHROPIC_MODEL}`);
    
    // Validate key format
    if (anthropicKey.startsWith('sk-ant-api03-')) {
      console.log("✅ API key format looks valid");
    } else {
      console.log("⚠️ API key format may be invalid (should start with 'sk-ant-api03-')");
    }
  } else {
    console.log("❌ ANTHROPIC_API_KEY is missing");
  }
  
  // Check database URL (mask for security)
  const dbUrl = env.DATABASE_URL;
  if (dbUrl && dbUrl !== "postgres://username:password@your-neon-host:5432/wundara") {
    const maskedDb = dbUrl.substring(0, 20) + "...";
    console.log(`DATABASE_URL: ${maskedDb} (configured)`);
  } else {
    console.log("⚠️ DATABASE_URL appears to be placeholder/example");
  }
  
  // Check Clerk keys (mask for security)
  const clerkPub = env.CLERK_PUBLISHABLE_KEY;
  const clerkSecret = env.CLERK_SECRET_KEY;
  
  if (clerkPub && clerkSecret) {
    console.log(`CLERK_PUBLISHABLE_KEY: ${clerkPub.substring(0, 10)}... (configured)`);
    console.log(`CLERK_SECRET_KEY: ${clerkSecret.substring(0, 10)}... (configured)`);
  } else {
    console.log("⚠️ Clerk authentication keys missing");
  }
  
  console.log("================================\n");
}

export function getApiIntegrationStatus() {
  const anthropicKey = env.ANTHROPIC_API_KEY;
  const dbUrl = env.DATABASE_URL;
  
  return {
    anthropicReady: anthropicKey && anthropicKey.startsWith('sk-ant-api03-') && anthropicKey.length > 50,
    databaseReady: dbUrl && dbUrl !== "postgres://username:password@your-neon-host:5432/wundara",
    developmentMode: env.NODE_ENV === "development"
  };
}
