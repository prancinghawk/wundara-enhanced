#!/usr/bin/env ts-node

/**
 * Build script to generate curriculum library from CSV data
 * 
 * Usage: npm run build-curriculum
 */

import { buildCurriculumLibrary } from '../utils/curriculum-parser';

console.log('🏗️  Building curriculum library from CSV data...');
console.log('');

try {
  buildCurriculumLibrary();
  console.log('');
  console.log('🎉 Curriculum library build complete!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Review the generated file: client/src/utils/curriculumLibrary.ts');
  console.log('2. Restart your development server to use the new curriculum data');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
