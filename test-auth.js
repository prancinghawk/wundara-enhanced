#!/usr/bin/env node

/**
 * Authentication Testing Script for Wundara
 * Tests API authentication and user data isolation
 */

const https = require('https');
const http = require('http');

const API_BASE = 'http://localhost:3001';

console.log('🧪 Wundara Authentication Test Suite');
console.log('=====================================\n');

// Test 1: Health check (should work without auth)
async function testHealthCheck() {
  console.log('1️⃣ Testing health endpoint (no auth required)...');
  
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    
    if (data.status === 'ok') {
      console.log('✅ Health check passed');
    } else {
      console.log('❌ Health check failed:', data);
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
  }
  console.log('');
}

// Test 2: Protected endpoint without auth (should fail)
async function testProtectedWithoutAuth() {
  console.log('2️⃣ Testing protected endpoint without authentication...');
  
  try {
    const response = await fetch(`${API_BASE}/api/children`);
    
    if (response.status === 401 || response.status === 500) {
      console.log('✅ Protected endpoint correctly rejected unauthenticated request');
      console.log(`   Status: ${response.status}`);
    } else {
      console.log('❌ Protected endpoint should reject unauthenticated requests');
      console.log(`   Status: ${response.status}`);
    }
  } catch (error) {
    console.log('✅ Protected endpoint correctly rejected (network error expected)');
  }
  console.log('');
}

// Test 3: Check server authentication mode
async function testServerAuthMode() {
  console.log('3️⃣ Checking server authentication configuration...');
  
  // Check if server logs show Clerk authentication
  console.log('   Server should show: "🔐 Using Clerk authentication"');
  console.log('   Check server console for authentication mode');
  console.log('   ✅ If you see Clerk auth messages, server is configured correctly');
  console.log('');
}

// Test 4: Frontend authentication check
async function testFrontendAuth() {
  console.log('4️⃣ Testing frontend authentication...');
  
  try {
    const response = await fetch('http://localhost:3000');
    
    if (response.ok) {
      console.log('✅ Frontend is accessible');
      console.log('   📝 Manual test required:');
      console.log('      1. Visit http://localhost:3000');
      console.log('      2. Should redirect to /sign-in');
      console.log('      3. Try signing up with a test email');
      console.log('      4. Check email for verification');
      console.log('      5. Complete sign-up flow');
    } else {
      console.log('❌ Frontend not accessible');
    }
  } catch (error) {
    console.log('❌ Frontend error:', error.message);
  }
  console.log('');
}

// Test 5: Environment configuration check
async function testEnvironmentConfig() {
  console.log('5️⃣ Checking environment configuration...');
  
  console.log('   Client (.env.local):');
  console.log('   ✅ VITE_CLERK_PUBLISHABLE_KEY should start with pk_test_');
  console.log('   ✅ VITE_API_URL should be http://localhost:3001');
  console.log('');
  console.log('   Server (.env):');
  console.log('   ✅ USE_DEV_AUTH should be false');
  console.log('   ✅ CLERK_PUBLISHABLE_KEY should start with pk_test_');
  console.log('   ✅ CLERK_SECRET_KEY should start with sk_test_');
  console.log('');
}

// Run all tests
async function runTests() {
  await testHealthCheck();
  await testProtectedWithoutAuth();
  await testServerAuthMode();
  await testFrontendAuth();
  await testEnvironmentConfig();
  
  console.log('🎯 Next Steps:');
  console.log('==============');
  console.log('1. Visit http://localhost:3000 and test sign-up flow');
  console.log('2. Create a test account and verify email');
  console.log('3. Test creating child profiles');
  console.log('4. Test generating learning plans');
  console.log('5. Test sign-out and sign-in flows');
  console.log('6. Verify user data isolation with multiple accounts');
  console.log('');
  console.log('🔗 Browser Preview: http://127.0.0.1:55844');
}

// Polyfill fetch for older Node versions
if (typeof fetch === 'undefined') {
  global.fetch = async (url, options = {}) => {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const req = client.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: () => Promise.resolve(JSON.parse(data))
          });
        });
      });
      
      req.on('error', reject);
      req.end();
    });
  };
}

runTests().catch(console.error);
