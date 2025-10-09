import { StackServerApp, StackClientApp } from "@stackframe/stack";

// Client-side Stack app
export const stackClientApp = new StackClientApp({
  projectId: import.meta.env.VITE_STACK_PROJECT_ID || "ddb5065b-a008-4f51-b576-0cbced7f83c2",
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY || "pck_eddnhmpctz5rnm6brbqphxj4t52xanw610e81xbajj1d0",
  tokenStore: "cookie", // Use cookie-based token storage for web apps
});

// Server-side Stack app (for API routes if needed)
export const stackServerApp = new StackServerApp({
  projectId: import.meta.env.VITE_STACK_PROJECT_ID || "ddb5065b-a008-4f51-b576-0cbced7f83c2",
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY || "pck_eddnhmpctz5rnm6brbqphxj4t52xanw610e81xbajj1d0",
  secretServerKey: import.meta.env.VITE_STACK_SECRET_SERVER_KEY || "ssk_myah7x4azn49pnnsbendkxzmvet5hwvcjz5wjx0747bd8",
  tokenStore: "cookie",
});
