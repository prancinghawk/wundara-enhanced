// Test script to verify curriculum context service
const { curriculumContextService } = require('./dist/services/curriculumContext.js');

console.log('🧪 Testing Curriculum Context Service');
console.log('=====================================');

// Test service initialization
console.log('📋 Service Summary:', curriculumContextService.getSummary());
console.log('📚 Available Subjects:', curriculumContextService.getAvailableSubjects());

// Test context for different year levels
const testYearLevels = ['Foundation Year', 'Year 1', 'Year 3', 'Year 7'];

for (const yearLevel of testYearLevels) {
  console.log(`\n🎯 Testing ${yearLevel}:`);
  const context = curriculumContextService.getContextForYearLevel(yearLevel, 'English');
  
  if (context) {
    console.log(`✅ Context found (${context.length} characters)`);
    // Show first 200 characters
    console.log('Preview:', context.substring(0, 200) + '...');
  } else {
    console.log('❌ No context found');
  }
}
