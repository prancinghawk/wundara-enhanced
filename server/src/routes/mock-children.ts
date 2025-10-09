import { Router } from "express";
import { hybridRequireAuth, AuthedRequest, getUserId } from "../middleware/hybrid-auth";
import { db } from "../config/db";
import { children, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const mockChildrenRouter = Router();

// Helper function to ensure dev user exists in database
async function ensureDevUserExists(userId: string) {
  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (!existingUser) {
      console.log('👤 Creating dev user in database:', userId);
      const [newUser] = await db
        .insert(users)
        .values({
          clerkId: userId,
          email: `${userId}@dev.local`,
          name: 'Dev User',
        })
        .returning();
      console.log('✅ Dev user created with ID:', newUser.id);
      return newUser.id;
    }
    return existingUser.id;
  } catch (error) {
    console.error('❌ Error ensuring dev user exists:', error);
    throw error;
  }
}

// List children for user
mockChildrenRouter.get("/", hybridRequireAuth(), async (req: AuthedRequest, res: any) => {
  try {
    const clerkId = getUserId(req);
    
    // Get database user ID from Clerk ID
    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
    if (!user) {
      return res.status(404).json({ error: 'User not found in database' });
    }
    
    console.log('📋 Fetching children for user:', clerkId);
    const rows = await db.select().from(children).where(eq(children.userId, user.id));
    console.log('✅ Found', rows.length, 'children');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching children:', error);
    res.status(500).json({ error: 'Failed to fetch children' });
  }
});

// Create child profile
mockChildrenRouter.post("/", hybridRequireAuth(), async (req: AuthedRequest, res: any) => {
  try {
    const clerkId = getUserId(req);
    console.log('🔑 Clerk ID:', clerkId);
    
    // Get database user ID from Clerk ID
    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
    if (!user) {
      return res.status(404).json({ error: 'User not found in database' });
    }
    
    console.log('👤 Database user ID:', user.id);
    
    const { firstName, ageYears, neurotype, interests, learningContext, state } = req.body ?? {};
    
    console.log('📝 Creating child profile:', {
      userId: user.id,
      firstName,
      ageYears,
      neurotype: neurotype?.substring(0, 50),
      interests: interests?.substring(0, 50),
      learningContext,
      state
    });
    
    const [inserted] = await db
      .insert(children)
      .values({ userId: user.id, firstName, ageYears, neurotype, interests, learningContext, state })
      .returning();
      
    console.log('✅ Child profile created with ID:', inserted.id);
    res.status(201).json(inserted);
  } catch (error) {
    console.error('❌ Error creating child - Full error:', error);
    console.error('❌ Error stack:', (error as Error).stack);
    res.status(500).json({ error: 'Failed to create child', details: (error as Error).message });
  }
});

// Update child profile
mockChildrenRouter.put("/:id", hybridRequireAuth(), async (req: AuthedRequest, res: any) => {
  try {
    const clerkId = getUserId(req);
    const { id } = req.params;
    const values = req.body ?? {};
    
    console.log('📝 Updating child profile:', id);
    const updated = await db
      .update(children)
      .set(values)
      .where(eq(children.id, id))
      .returning();
      
    if (!updated[0]) {
      return res.status(404).json({ error: "Child not found" });
    }
    
    console.log('✅ Child profile updated');
    res.json(updated[0]);
  } catch (error) {
    console.error('❌ Error updating child:', error);
    res.status(500).json({ error: 'Failed to update child' });
  }
});

// Delete child profile
mockChildrenRouter.delete("/:id", hybridRequireAuth(), async (req: AuthedRequest, res: any) => {
  try {
    const clerkId = getUserId(req);
    const { id } = req.params;
    
    console.log('🗑️ Deleting child profile:', id);
    const deleted = await db.delete(children).where(eq(children.id, id)).returning();
    
    if (!deleted[0]) {
      return res.status(404).json({ error: "Child not found" });
    }
    
    console.log('✅ Child profile deleted');
    res.status(204).send();
  } catch (error) {
    console.error('❌ Error deleting child:', error);
    res.status(500).json({ error: 'Failed to delete child' });
  }
});
