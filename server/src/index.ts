import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { childrenRouter } from "./routes/children";
import { plansRouter } from "./routes/plans";
import { progressRouter } from "./routes/progress";
import { mockChildrenRouter } from "./routes/mock-children";
import { mockPlansRouter } from "./routes/mock-plans";
import { devPlansRouter } from "./routes/dev-plans";
import { debugApiConfiguration, getApiIntegrationStatus } from "./utils/debug-api";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok", service: "wundara-server" }));

// Route selection based on environment
if (env.NODE_ENV === "development") {
  const useRealAI = process.env.USE_REAL_AI === "true";
  if (useRealAI) {
    console.log("🤖 Running in development mode with REAL AI and dev auth");
    app.use("/api/children", mockChildrenRouter);
    app.use("/api/plans", devPlansRouter);
  } else {
    console.log("🔧 Running in development mode with mock data");
    app.use("/api/children", mockChildrenRouter);
    app.use("/api/plans", mockPlansRouter);
  }
} else {
  app.use("/api/children", childrenRouter);
  app.use("/api/plans", plansRouter);
}

app.use("/api/progress", progressRouter);

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(Number(env.PORT), () => {
  console.log(`Wundara server running on http://localhost:${env.PORT}`);
  
  // Debug API configuration on startup
  debugApiConfiguration();
  
  const status = getApiIntegrationStatus();
  if (!status.anthropicReady) {
    console.log("⚠️  To enable real AI plan generation, set up a valid ANTHROPIC_API_KEY");
    console.log("   Get your API key from: https://console.anthropic.com/");
  }
  if (!status.databaseReady) {
    console.log("⚠️  To enable real data persistence, configure DATABASE_URL");
    console.log("   Set up a PostgreSQL database (e.g., Neon, Supabase, or local)");
  }
});
