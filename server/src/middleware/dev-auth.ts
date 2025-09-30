import { Request, Response, NextFunction } from "express";

export interface AuthedRequest extends Request {
  auth?: {
    userId: string;
  };
}

// Development middleware that bypasses authentication
export function devRequireAuth() {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    // In development, add a mock user ID
    req.auth = {
      userId: "dev-user-123"
    };
    next();
  };
}

export function getUserId(req: AuthedRequest): string {
  const userId = req.auth?.userId;
  if (!userId) throw new Error("Unauthenticated");
  return userId;
}
