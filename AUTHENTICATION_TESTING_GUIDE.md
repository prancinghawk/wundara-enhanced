# Wundara Authentication Testing Guide

## **🎯 Complete Testing Checklist**

### **Phase 1: Basic Authentication Flow**

#### **Test 1: Sign-Up Flow**
1. **Visit**: http://127.0.0.1:55844
2. **Expected**: Redirect to `/sign-in` page
3. **Action**: Click "Create an account" or navigate to `/sign-up`
4. **Fill Form**:
   - Email: Use a real email you can access
   - Password: Meet requirements (8+ chars, mix of letters/numbers)
   - First Name: Optional but recommended
5. **Submit**: Click "Sign Up"
6. **Check Email**: Look for Clerk verification email
7. **Verify**: Click verification link in email
8. **Expected**: Redirect to `/dashboard` with user profile in top bar

#### **Test 2: Sign-In Flow**
1. **Sign Out**: Click user profile dropdown → "Sign Out"
2. **Expected**: Redirect to `/sign-in`
3. **Enter Credentials**: Use the account you just created
4. **Submit**: Click "Sign In"
5. **Expected**: Redirect to `/dashboard`
6. **Verify**: User profile appears in top bar

#### **Test 3: Route Protection**
1. **While Signed Out**: Try to access `/dashboard` directly
2. **Expected**: Redirect to `/sign-in`
3. **While Signed In**: Access all protected routes:
   - `/dashboard` ✅
   - `/plans` ✅
   - `/profiles` ✅
   - `/progress` ✅

### **Phase 2: User Data Isolation**

#### **Test 4: Child Profile Creation**
1. **Navigate**: Go to `/profiles`
2. **Create Profile**: Add a test child
   - First Name: "Test Child"
   - Age: 8
   - Interests: "dinosaurs, art"
   - Neurotype: Select any option
3. **Save**: Submit the form
4. **Verify**: Child appears in profiles list

#### **Test 5: Plan Generation**
1. **Navigate**: Go to `/plans`
2. **Generate Plan**: Create a plan for your test child
3. **Verify**: Plan appears in plans list
4. **View Plan**: Click to view plan details

#### **Test 6: Multi-User Isolation**
1. **Create Second Account**: Sign up with different email
2. **Expected**: Empty profiles and plans (no data from first user)
3. **Create Different Data**: Add different child profiles
4. **Switch Accounts**: Sign out and sign in with first account
5. **Verify**: Only see data from first account

### **Phase 3: API Security**

#### **Test 7: API Authentication**
1. **Open Dev Tools**: F12 → Network tab
2. **Make API Call**: Navigate to profiles or plans
3. **Check Headers**: Look for `Authorization: Bearer ...` in requests
4. **Verify**: API calls include JWT tokens

#### **Test 8: Direct API Access**
1. **Terminal Test**: Run `curl http://localhost:3001/api/children`
2. **Expected**: Error response (401 or 500)
3. **Confirms**: API properly protected

### **Phase 4: Session Management**

#### **Test 9: Session Persistence**
1. **Sign In**: Complete sign-in flow
2. **Refresh Page**: F5 or Cmd+R
3. **Expected**: Remain signed in
4. **Close Browser**: Completely close and reopen
5. **Expected**: Remain signed in (within session timeout)

#### **Test 10: Session Timeout**
1. **Check Clerk Dashboard**: Note session timeout setting
2. **Wait**: Leave app idle for configured time
3. **Expected**: Automatic sign-out after timeout

### **Phase 5: Error Handling**

#### **Test 11: Network Errors**
1. **Stop Server**: Kill server process
2. **Try API Action**: Attempt to load profiles
3. **Expected**: Graceful error handling
4. **Restart Server**: Start server again
5. **Expected**: App recovers automatically

#### **Test 12: Invalid Credentials**
1. **Sign Out**: Use sign-out button
2. **Wrong Password**: Try signing in with wrong password
3. **Expected**: Clear error message
4. **Wrong Email**: Try non-existent email
5. **Expected**: Appropriate error handling

## **🔧 Troubleshooting Common Issues**

### **Issue: "Redirect URL not allowed"**
**Solution**: 
1. Go to Clerk Dashboard → Settings → Paths
2. Add `http://localhost:3000` to allowed redirects
3. Add specific paths: `/dashboard`, `/sign-in`, `/sign-up`

### **Issue: "Invalid publishable key"**
**Solution**:
1. Check `.env.local` file in client directory
2. Verify key starts with `pk_test_`
3. No extra spaces or characters
4. Restart client dev server

### **Issue: API returns "Unauthenticated"**
**Solution**:
1. Check server `.env` file
2. Verify `USE_DEV_AUTH=false`
3. Verify `CLERK_SECRET_KEY` starts with `sk_test_`
4. Restart server

### **Issue: Infinite redirect loop**
**Solution**:
1. Check that `/sign-in` and `/sign-up` routes are public
2. Verify `ProtectedRoute` excludes auth pages
3. Clear browser cache and cookies

## **✅ Success Criteria**

Your authentication system is working correctly if:

- ✅ **Sign-up flow** creates new users with email verification
- ✅ **Sign-in flow** authenticates existing users
- ✅ **Route protection** blocks unauthenticated access
- ✅ **API security** requires valid JWT tokens
- ✅ **User isolation** shows only user-specific data
- ✅ **Session management** persists across browser sessions
- ✅ **Error handling** gracefully manages failures
- ✅ **User experience** is smooth and intuitive

## **🚀 Production Readiness**

Once all tests pass, your authentication system is ready for:

1. **Production deployment** with live Clerk keys
2. **Real user onboarding** and registration
3. **Secure data handling** with proper user isolation
4. **Scalable user management** through Clerk dashboard
5. **Monitoring and analytics** of authentication metrics

## **📊 Monitoring Recommendations**

Track these metrics in production:
- Sign-up conversion rates
- Sign-in success rates
- Session duration and timeout rates
- API authentication failures
- User retention and engagement
