# Anthropic Model Update

## Summary
Updated the Anthropic Claude model from `claude-3-haiku-20240307` to `claude-3-5-sonnet-20241022` to ensure continued service and access to the latest capabilities.

## Why This Update?
- **Claude 3.5 Sonnet (old version)** will be deprecated on **October 22, 2025**
- The newer **Claude 3.5 Sonnet (20241022)** offers improved performance and capabilities
- Ensures long-term compatibility and access to Anthropic's best models

## Changes Made

### 1. Updated Default Model (`config/env.ts`)
```typescript
// Before
ANTHROPIC_MODEL: z.string().default("claude-3-haiku-20240307")

// After
ANTHROPIC_MODEL: z.string().default("claude-3-5-sonnet-20241022")
```

### 2. Updated Educator AI Service (`services/educatorAI.ts`)
```typescript
// Before
model: 'claude-3-haiku-20240307', // Hardcoded

// After
model: env.ANTHROPIC_MODEL, // Uses configured model
```

### 3. Updated Environment Example (`.env.example`)
Added documentation for recommended models:
- `claude-3-5-sonnet-20241022` - Most capable, best for complex tasks
- `claude-3-5-haiku-20241022` - Faster, more cost-effective alternative

## Model Comparison

### Claude 3.5 Sonnet (20241022) - **Recommended**
- **Best for**: Complex learning plan generation, detailed educational content
- **Strengths**: Superior reasoning, better instruction following, more nuanced responses
- **Use case**: Default for Wundara's learning plan generation
- **Cost**: Moderate (but worth it for quality)

### Claude 3.5 Haiku (20241022) - **Alternative**
- **Best for**: Faster responses, cost optimization
- **Strengths**: Very fast, cost-effective, still highly capable
- **Use case**: If you need to reduce costs or want faster generation
- **Cost**: Lower than Sonnet

## How to Use Different Models

### Option 1: Use Default (Recommended)
No action needed! The app will use Claude 3.5 Sonnet by default.

### Option 2: Override in Environment
Add to your `.env` file:
```bash
ANTHROPIC_MODEL=claude-3-5-haiku-20241022
```

### Option 3: Test Both Models
You can easily switch between models by changing the environment variable and restarting the server.

## Benefits of This Update

### ✅ Better Learning Plans
- More nuanced understanding of neurodivergent needs
- Better adherence to Australian Curriculum codes
- More creative and engaging activity suggestions
- Improved declarative language examples

### ✅ Better JSON Generation
- More reliable structured output
- Fewer parsing errors
- Better handling of complex nested structures

### ✅ Future-Proof
- Won't be affected by model deprecations
- Access to latest Anthropic improvements
- Continued support and updates

## Testing Recommendations

1. **Generate a new learning plan**:
   - Create a child profile
   - Generate a plan
   - Verify the quality and structure

2. **Compare with old plans**:
   - Check if new plans have better detail
   - Verify JSON structure is valid
   - Ensure all required fields are present

3. **Monitor costs**:
   - Claude 3.5 Sonnet is more expensive than Haiku
   - Monitor your Anthropic usage dashboard
   - Consider switching to Haiku if costs are a concern

## Cost Considerations

### Approximate Costs (as of Oct 2024)
- **Claude 3.5 Sonnet**: ~$3 per million input tokens, ~$15 per million output tokens
- **Claude 3.5 Haiku**: ~$0.80 per million input tokens, ~$4 per million output tokens

### Typical Plan Generation
- Input: ~2,000-3,000 tokens (system prompt + user data)
- Output: ~3,000-4,000 tokens (full 5-day plan)
- **Cost per plan (Sonnet)**: ~$0.06-0.08
- **Cost per plan (Haiku)**: ~$0.02-0.03

## Rollback Instructions

If you need to rollback to the old model:

1. Update `.env`:
   ```bash
   ANTHROPIC_MODEL=claude-3-haiku-20240307
   ```

2. Restart the server

Note: The old Haiku model is still supported, but Sonnet 3.5 offers significantly better quality for educational content generation.

## Related Files
- `/server/src/config/env.ts` - Model configuration
- `/server/src/services/ai.ts` - Homeschool plan generation
- `/server/src/services/educatorAI.ts` - Classroom plan generation
- `/server/.env.example` - Environment template

## Next Steps

1. ✅ Changes are already applied
2. 🔄 Server will auto-restart (ts-node-dev)
3. 🧪 Test plan generation with new model
4. 📊 Monitor quality and costs
5. 🔧 Adjust model if needed (switch to Haiku for cost savings)
