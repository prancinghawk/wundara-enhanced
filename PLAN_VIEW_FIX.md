# Plan View Fix - JSON Parsing Issue

## Problem Summary
Plans generated for homeschool users were not displaying properly in the detailed view. The error showed:
- `404` when trying to fetch from `/api/educator-plans` endpoint (expected, as this is for classroom plans)
- Successfully fetched from `/api/plans` endpoint
- **JSON parsing error**: "Unterminated string in JSON at position 17213"

## Root Cause
The AI (Claude) was generating JSON responses that were:
1. Sometimes malformed (unterminated strings)
2. Potentially too large and getting truncated
3. Not properly cleaned of markdown code blocks

## Changes Made

### 1. **Frontend: WeeklyPlanView.tsx** - Better Error Handling
- Added `parseError` tracking to capture JSON parsing failures
- Improved fallback UI when structured data can't be parsed
- Added error message display showing the specific parsing error
- Added "Regenerate Plan" button for easy recovery
- Made the raw data viewer more user-friendly with a collapsible section

### 2. **Backend: AI Service (ai.ts)** - Improved JSON Extraction
- Added cleanup for markdown code blocks (```json ... ```)
- Added regex-based JSON extraction as a fallback
- Better logging to identify where JSON parsing fails
- Attempts to extract valid JSON even from partially malformed responses

### 3. **Backend: Plans Route (plans.ts)** - Better Logging & Type Safety
- Added warning logs when storing unstructured data
- Fixed TypeScript type errors (null vs undefined, Date formatting)
- Better visibility into when plans fail to parse

## User Experience Flow

### For Homeschool Users (Port 3000)
1. User generates a plan for their child
2. Plan is stored with both `structured` and `raw` JSON
3. When viewing:
   - If `structured` data exists → Shows beautiful formatted view
   - If only `raw` exists → Attempts to parse it
   - If parsing fails → Shows fallback UI with:
     - Clear error message
     - Option to regenerate
     - Collapsible raw data viewer

### For Classroom Users (Port 3002)
- Uses separate `/api/educator-plans` endpoint
- Different data structure (direct plan object, not wrapped in `planJson`)
- Already handled correctly in the code

## Testing Recommendations

1. **Test existing broken plan**:
   - Navigate to the plan with ID `e2f81871-469e-4370-9ca6-b5adec447209`
   - Should now show fallback UI instead of crashing
   - Should display the parsing error clearly

2. **Test new plan generation**:
   - Generate a new plan for Ted (or any child)
   - Verify it displays correctly in structured format
   - Check server logs for any parsing warnings

3. **Test both user types**:
   - Homeschool user (port 3000) → `/api/plans` endpoint
   - Classroom user (port 3002) → `/api/educator-plans` endpoint

## Future Improvements

1. **Add retry logic**: If JSON parsing fails, automatically retry generation
2. **Increase max_tokens**: Current limit is 4096, might need more for complex plans
3. **Add JSON schema validation**: Validate structure before storing
4. **Add plan migration**: Create a script to regenerate broken plans
5. **Better AI prompt**: Further refine the prompt to ensure valid JSON output

## Related Files
- `/client/src/pages/WeeklyPlanView.tsx` - Plan display component
- `/server/src/services/ai.ts` - AI plan generation service
- `/server/src/routes/plans.ts` - Homeschool plans API
- `/server/src/routes/educator-plans.ts` - Classroom plans API
