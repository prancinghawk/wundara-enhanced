# Database Setup Guide

This guide explains how to set up the database for storing both markdown content and structured data for classroom plans.

## Database Schema

The database stores classroom plans with two key data types:

1. **Markdown Content**: Full AI-generated markdown from the educator AI service
2. **Structured Metadata**: Parsed data extracted from markdown for UI display

### Key Tables

#### `ClassroomPlan`
- Stores complete classroom plans with both markdown and structured data
- Links to student IDs and classroom configurations
- Tracks usage and performance metrics

#### `ClassroomConfiguration` 
- Stores reusable classroom setups (students, resources, layout)
- Enables educators to avoid recreating classroom data
- Tracks usage patterns and plan generation history

#### `HomeschoolPlan`
- Stores individual child learning plans
- Maintains compatibility with existing homeschool functionality

#### `Child`
- Individual child profiles for homeschool users
- Links to Clerk user authentication

## Setup Instructions

### 1. Environment Variables

Add to your `.env` file:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/wundara_db"

# Optional: For development
DIRECT_URL="postgresql://username:password@localhost:5432/wundara_db"
```

### 2. Install Dependencies

```bash
# Install Prisma CLI globally (optional)
npm install -g prisma

# Install project dependencies
cd server
npm install prisma @prisma/client
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# Or push schema without migrations (for development)
npx prisma db push
```

### 4. Verify Setup

```bash
# Open Prisma Studio to view data
npx prisma studio
```

## Data Structure

### Markdown Storage
```typescript
{
  markdownContent: `
# 🌿 Amazing Animals and Creatures Learning Adventure

**Inclusive Learning Plan | Year 3 | NSW | Mathematics**
**Theme**: Exploring the fascinating world of animals

## 🗓 Monday – **"Animal Counting Adventures"**

### 🧩 **1. Dinosaur Data Collection**
🎯 *AC9M3N01, AC9M3ST01*
🧠 *Objective*: Collect and organize data about dinosaur characteristics
...
  `
}
```

### Structured Metadata
```typescript
{
  metadata: {
    days: [
      {
        dayIndex: 0,
        dayName: "Monday",
        dayFocus: "Animal Counting Adventures",
        activities: [
          {
            title: "Dinosaur Data Collection",
            objective: "Collect and organize data about dinosaur characteristics",
            curriculumCodes: ["AC9M3N01", "AC9M3ST01"],
            materials: ["Dinosaur fact cards", "Tally charts", "Colored pencils"],
            instructions: "1. Explore dinosaur fact cards...",
            declarativeLanguage: "I wonder what patterns we might discover...",
            adultSupport: "Have visual supports ready...",
            estimatedDuration: "30 minutes"
          }
        ]
      }
    ],
    weekOverview: {
      transitionStrategies: [...],
      emergencyProtocols: [...],
      reflectionPrompts: [...],
      homeSchoolConnection: [...],
      inclusionNotes: [...]
    }
  }
}
```

## Migration from In-Memory Storage

### Current State
- Plans stored in `Map<string, ClassroomPlan>`
- Configurations stored in `Map<string, any>`
- Data lost on server restart

### Database Migration Steps

1. **Enable Prisma Client**
   ```typescript
   // Uncomment in /server/src/lib/prisma.ts
   import { PrismaClient } from '@prisma/client';
   export const prisma = new PrismaClient();
   ```

2. **Update Route Handlers**
   ```typescript
   // Replace in-memory storage with database calls
   const plan = await ClassroomPlanService.createPlan(databasePlan);
   ```

3. **Data Migration Script**
   ```typescript
   // Migrate existing in-memory data to database
   for (const [id, plan] of classroomPlans) {
     await ClassroomPlanService.createPlan(plan);
   }
   ```

## Benefits

### For Educators
- **Persistent Storage**: Plans survive server restarts
- **Version History**: Track plan evolution over time
- **Usage Analytics**: Understand which plans work best
- **Backup & Recovery**: Data safety and reliability

### For Development
- **Structured Queries**: Efficient data retrieval
- **Relationships**: Link plans to students and configurations
- **Scalability**: Handle growing user base
- **Analytics**: Track platform usage and performance

### For Features
- **Plan Templates**: Reuse successful plan structures
- **Collaboration**: Share plans between educators
- **Reporting**: Generate usage and outcome reports
- **Search**: Find plans by content, curriculum codes, themes

## Production Considerations

### Performance
- Index frequently queried fields (educatorName, yearLevel, subject)
- Use connection pooling for high concurrency
- Consider read replicas for analytics queries

### Security
- Encrypt sensitive student data
- Implement row-level security for multi-tenant isolation
- Regular database backups and disaster recovery

### Monitoring
- Track query performance and optimization opportunities
- Monitor storage growth and archival strategies
- Set up alerts for database health and availability

## Next Steps

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Update route handlers to use Prisma
5. Test data persistence and retrieval
6. Implement backup and monitoring

The database structure is designed to support both current functionality and future enhancements while maintaining data integrity and performance.
