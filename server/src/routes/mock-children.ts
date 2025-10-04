import { Router } from "express";
import { hybridRequireAuth, AuthedRequest, getUserId } from "../middleware/hybrid-auth";

export const mockChildrenRouter = Router();

// Mock children data with proper UUIDs
const mockChildren = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001", // Fixed UUID for Emma
    userId: "dev-user-123",
    firstName: "Emma",
    ageYears: 8,
    neurotype: "ADHD",
    interests: "dinosaurs, art, music",
    learningContext: "homeschool",
    state: "NSW",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002", // Fixed UUID for Alex
    userId: "dev-user-123",
    firstName: "Alex",
    ageYears: 10,
    neurotype: "Autistic",
    interests: "space, robots, coding",
    learningContext: "homeschool", 
    state: "VIC",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// List children for user
mockChildrenRouter.get("/", hybridRequireAuth(), async (req: AuthedRequest, res) => {
  const userId = getUserId(req);
  const userChildren = mockChildren.filter(child => child.userId === userId);
  res.json(userChildren);
});

// Create child profile
mockChildrenRouter.post("/", hybridRequireAuth(), async (req: AuthedRequest, res) => {
  const userId = getUserId(req);
  const { firstName, ageYears, neurotype, interests, learningContext, state } = req.body ?? {};
  
  // Generate proper UUID for database compatibility
  const { randomUUID } = await import('crypto');
  const newChild = {
    id: randomUUID(),
    userId,
    firstName,
    ageYears,
    neurotype,
    interests,
    learningContext,
    state,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockChildren.push(newChild);
  res.status(201).json(newChild);
});

// Update child profile
mockChildrenRouter.put("/:id", hybridRequireAuth(), async (req: AuthedRequest, res) => {
  const userId = getUserId(req);
  const { id } = req.params;
  const { firstName, ageYears, neurotype, interests, learningContext, state } = req.body ?? {};
  
  const childIndex = mockChildren.findIndex(child => child.id === id && child.userId === userId);
  
  if (childIndex === -1) {
    return res.status(404).json({ error: "Child not found" });
  }
  
  // Update the child
  mockChildren[childIndex] = {
    ...mockChildren[childIndex],
    firstName,
    ageYears,
    neurotype,
    interests,
    learningContext,
    state,
    updatedAt: new Date().toISOString()
  };
  
  res.json(mockChildren[childIndex]);
});

// Delete child profile
mockChildrenRouter.delete("/:id", hybridRequireAuth(), async (req: AuthedRequest, res) => {
  const userId = getUserId(req);
  const { id } = req.params;
  
  const childIndex = mockChildren.findIndex(child => child.id === id && child.userId === userId);
  
  if (childIndex === -1) {
    return res.status(404).json({ error: "Child not found" });
  }
  
  // Remove the child
  mockChildren.splice(childIndex, 1);
  res.status(204).send();
});
