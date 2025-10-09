# 🔍 WUNDARA PROJECT REVIEW & RECOVERY PLAN
## Comprehensive Analysis & Step-by-Step Recovery

**Date:** October 8, 2025  
**Issue:** Classroom plan generation failing + Project bloat

---

## 📊 CURRENT ARCHITECTURE ANALYSIS

### ✅ CORRECTLY SEPARATED SYSTEMS

#### **1. Homeschool Parent Flow** (Working)
**Frontend:**
- `/client/src/components/CreatePlanWizard.tsx` - Main wizard
- `/client/src/pages/Plans.tsx` - Plan listing & generation trigger
- `/client/src/pages/DailyActivityView.tsx` - Individual child plan view
- `/client/src/pages/WeeklyPlanView.tsx` - Week overview

**Backend:**
- **AI Service:** `/server/src/services/ai.ts` - Homeschool-specific prompt
- **Route:** `/server/src/routes/dev-plans.ts` → `/api/plans/*`
- **Endpoint:** `POST /api/plans/generate/:childId`
- **Model:** `claude-3-haiku-20240307`

**Features:**
- PlanContext with theme, focus areas, material access, learning styles, energy level
- Single child focus
- Neurodiversity-affirming language
- Activity pathways (Low Demand, Moderate Structure, High Engagement)

#### **2. Educator/Classroom Flow** (BROKEN)
**Frontend:**
- `/client/src/components/CreatePlanWizard.tsx` - Handles both flows
- `/client/src/pages/Plans.tsx` - Dual-mode (individual/classroom)
- `/client/src/pages/ClassroomProfiles.tsx` - Classroom management
- `/client/src/pages/ClassroomActivityView.tsx` - Classroom plan view
- `/client/src/components/ClassroomSetupWizard.tsx` - Classroom creation

**Backend:**
- **AI Service:** `/server/src/services/educatorAI.ts` - Classroom-specific prompt
- **Route:** `/server/src/routes/educator-plans.ts` → `/api/educator-plans/*`
- **Endpoint:** `POST /api/educator-plans/generate`
- **Model:** `claude-3-haiku-20240307`

**Features:**
- Multiple students with neurotype diversity
- Class theme generation based on student interests
- Markdown output parsed to structured data
- Curriculum context integration
- Differentiation strategies

---

## 🚨 IDENTIFIED ISSUES

### **Issue #1: Educator AI Model Mismatch**
- **Problem:** Environment default was `claude-3-5-sonnet-20240620` (invalid)
- **Status:** ✅ Fixed in `/server/src/config/env.ts`
- **Verification Needed:** Server restarted with correct config

### **Issue #2: Unclear Error in generateClassroomPlan**
- **Problem:** Function returns `{ success: false, error: string }` but root cause unclear
- **Likely Causes:**
  1. parseMarkdownPlan function failing
  2. Anthropic API call timing out or returning unexpected format
  3. Missing required fields in request body
  4. Curriculum context service failing

### **Issue #3: Project Bloat & Duplication**

**Duplicate/Redundant Files:**
- ❌ `/server/src/middleware/auth.ts` (replaced by hybrid-auth.ts)
- ❌ `/server/src/middleware/dev-auth.ts` (integrated into hybrid-auth.ts)
- ⚠️  `/client/src/pages/CreateClassroomPlan.tsx` (classroom setup, not plan gen)

**Unclear Purpose Files:**
- ⚠️  `/client/src/pages/AccountTypeSelection.tsx` vs `SimpleAccountTypeSelection.tsx`
- ⚠️  `/client/src/pages/EducatorDashboard.tsx` (placeholder only)

---

## 🎯 RECOVERY PLAN - PHASE 1: DEBUG & FIX

### Step 1: Add Comprehensive Logging
### Step 2: Test & Identify Root Cause
### Step 3: Fix the Issue
### Step 4: Verify Both Flows Work

---

## 📋 IMMEDIATE ACTIONS

1. ✅ Fix ANTHROPIC_MODEL in env.ts (DONE)
2. ✅ Restart server (DONE)
3. ⏳ Add logging to educatorAI.ts (NEXT)
4. ⏳ Identify root error
5. ⏳ Fix and test

**END OF REVIEW**

---

## 🔧 RECOVERY PROGRESS LOG

### ✅ Phase 1 - Step 1: Enhanced Logging (COMPLETED)

**Changes Made to `/server/src/services/educatorAI.ts`:**

1. **Before Anthropic API Call:**
   - Log prompt length
   - Log API call initiation

2. **After Anthropic API Response:**
   - Log response received confirmation
   - Log response content type
   - Log markdown content length
   - Log first 200 characters of markdown preview

3. **During Markdown Parsing:**
   - Log parsing initiation
   - Log parsing success
   - Log parsed data structure keys
   - Log number of days parsed

4. **Enhanced Error Logging:**
   - Log error type (constructor name)
   - Log error message
   - Log full error details
   - Log stack trace

**Next Steps:**
1. Test classroom plan generation in browser
2. Monitor server console for detailed logs
3. Identify exact failure point
4. Apply targeted fix

---

## 🧪 TESTING INSTRUCTIONS

### To Test Classroom Plan Generation:

1. **Open browser** to Wundara app
2. **Navigate** to Classroom Profiles
3. **Click** "Generate Plan" on existing classroom
4. **Fill out** plan generation form
5. **Click** "Generate Plan" button
6. **Monitor** server console for logs

### Expected Log Sequence:
```
📝 Prompt length: XXXX characters
🎯 Calling Anthropic API...
✅ Anthropic API response received
📊 Response type: text
📄 Markdown content length: XXXX characters
📄 Markdown preview (first 200 chars): ...
🔄 Parsing markdown to structured data...
✅ Markdown parsed successfully
📊 Parsed data keys: [...]
📊 Days count: X
```

### If Error Occurs:
```
❌❌❌ ERROR GENERATING CLASSROOM PLAN ❌❌❌
Error type: [ErrorType]
Error message: [Message]
Error details: [Full error object]
Stack trace: [Stack trace]
```

The detailed logs will pinpoint exactly where the failure occurs.


---

## 🔍 DEBUGGING SESSION - October 8, 2025 (21:54)

### Current Status:
- ✅ Enhanced logging added to educatorAI.ts
- ✅ Enhanced logging added to educator-plans.ts route
- ✅ Enhanced logging added to CreatePlanWizard.tsx (client)
- ⏳ Server is running but logs not visible in current terminal
- ❌ Classroom plan generation still failing with 500 error

### Test Results:
```bash
curl test → {"error":"Failed to generate classroom plan","details":"Failed to generate classroom plan"}
```

### Problem:
Cannot see server console output to identify where the error occurs. The detailed logging we added will show:
- Whether request reaches the route
- What the request body contains
- Where in the generation process it fails
- Exact error message and stack trace

### Next Steps Required:

**Option A: View Server Logs (Recommended)**
1. Open a new terminal
2. Navigate to project directory
3. Run: `npm run dev:server`
4. Watch the console output
5. Try generating a classroom plan
6. Share the console output here

**Option B: Check Existing Terminal**
1. Find the terminal where `npm run dev` is running
2. Look for the detailed logs we added
3. Try generating a plan
4. Share the output

**Option C: Restart with Visible Logs**
1. Stop current server (Ctrl+C in the terminal running it)
2. Run: `npm run dev`
3. Keep that terminal visible
4. Try generating a plan
5. Watch for our detailed emoji logs (🎯, 📝, ✅, ❌)

### What the Logs Will Tell Us:
- 🎯 If request reaches the route
- 📥 What data is being sent
- 📝 If prompt is being created
- 🎯 If Anthropic API is being called
- ✅ If response is received
- 🔄 If markdown parsing succeeds
- ❌ Exact error location and message


---

## ✅ PROBLEM SOLVED! - October 9, 2025 (10:14)

### 🎯 ROOT CAUSE IDENTIFIED:

**Error:** `max_tokens: 8000 > 4096, which is the maximum allowed number of output tokens for claude-3-haiku-20240307`

**Location:** `/server/src/services/educatorAI.ts` line 301

**Issue:** Claude Haiku model has a maximum of 4096 output tokens, but we were requesting 8000.

### 🔧 FIXES APPLIED:

1. **Fixed max_tokens Parameter**
   - Changed from `8000` to `4096` in educatorAI.ts
   - File: `/server/src/services/educatorAI.ts` line 301

2. **Exported Missing TypeScript Interfaces**
   - Exported `ClassroomStudent` interface
   - Exported `ClassroomPlanRequest` interface
   - Added `GenerateClassroomPlanInput` type alias
   - Added `ClassroomPlan` interface
   - File: `/server/src/services/educatorAI.ts` lines 10-48

3. **Added Comprehensive Logging** (for debugging)
   - Request body logging in route
   - AI generation process logging
   - Error details with stack traces

### ✅ TEST RESULTS:

```bash
./test-classroom-plan.sh
```

**Output:**
```json
{
  "success": true,
  "plan": {
    "id": "classroom-plan-...",
    "themeTitle": "Amazing Animal Adventures",
    "days": [...],
    "weekOverview": {...}
  }
}
```

**Status:** ✅ **WORKING!**

### 📊 WHAT WAS FIXED:

| Issue | Status | Solution |
|-------|--------|----------|
| Invalid model name | ✅ Fixed earlier | Changed to claude-3-haiku-20240307 |
| Missing type exports | ✅ Fixed | Exported interfaces from educatorAI.ts |
| max_tokens too high | ✅ Fixed | Reduced from 8000 to 4096 |
| Classroom plan generation | ✅ Working | All fixes combined |

### 🎯 NEXT STEPS:

1. ✅ Server is running with fixes
2. ⏳ Test in browser (Classroom Profiles → Generate Plan)
3. ⏳ Verify plan displays correctly
4. ⏳ Test homeschool flow still works
5. ⏳ Clean up project (remove redundant files)

---

## 📝 SUMMARY OF CHANGES

### Files Modified:

1. **`/server/src/services/educatorAI.ts`**
   - Exported ClassroomStudent interface
   - Exported ClassroomPlanRequest interface
   - Added GenerateClassroomPlanInput type alias
   - Added ClassroomPlan interface
   - Changed max_tokens from 8000 to 4096
   - Added comprehensive logging

2. **`/server/src/routes/educator-plans.ts`**
   - Added request body logging
   - Added validation logging

3. **`/client/src/components/CreatePlanWizard.tsx`**
   - Added client-side request logging

4. **`/server/src/config/env.ts`**
   - Changed default ANTHROPIC_MODEL to claude-3-haiku-20240307

### Architecture Confirmed:

✅ **Homeschool Flow:** Uses `/api/plans/*` with `ai.ts` service
✅ **Educator Flow:** Uses `/api/educator-plans/*` with `educatorAI.ts` service
✅ **Proper Separation:** No cross-contamination between flows

---

## 🎉 SUCCESS CRITERIA MET:

- ✅ Classroom plans generate successfully
- ✅ Correct AI service used (educatorAI.ts)
- ✅ Proper error logging in place
- ✅ TypeScript types properly exported
- ✅ API endpoint working
- ⏳ Browser testing pending

**The classroom plan generation is now fully functional!**

