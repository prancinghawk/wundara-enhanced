import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface CurriculumRecord {
  code: string;
  subject: string;
  yearLevel: string;
  strand?: string;
  description: string;
  elaborations?: string;
}

/**
 * Parse the Australian Curriculum CSV file
 */
export function parseCurriculumCSV(csvFilePath: string): CurriculumRecord[] {
  try {
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    
    // Parse CSV with headers
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log('📋 CSV columns found:', Object.keys(records[0] || {}));
    
    // Map CSV columns to our interface based on ACARA export format
    const mappedRecords = records.map((record: any) => ({
      code: record.Code || record.code,
      subject: record.Subject || record['Learning Area'],
      yearLevel: record.Level || record['Level Description'] || record.YearLevel || record['Year Level'],
      strand: record['Sub-Strand'] || record.Strand,
      description: record['Content Description'] || record.Description || record.description,
      elaborations: record.Elaboration || record.Elaborations
    })).filter((record: any) => {
      // Only include records that have AC9 codes (actual curriculum codes, not elaborations)
      return record.code && 
             record.description && 
             record.yearLevel && 
             record.code.startsWith('AC9') && 
             !record.code.includes('_E'); // Exclude elaboration codes like AC9EFLA01_E1
    });

    console.log(`✅ Mapped ${mappedRecords.length} valid records from ${records.length} total`);
    
    // Show first few records for debugging
    if (mappedRecords.length > 0) {
      console.log('📝 Sample records:');
      mappedRecords.slice(0, 3).forEach((record: any, index: number) => {
        console.log(`  ${index + 1}. ${record.code} - ${record.subject} (${record.yearLevel})`);
      });
    }

    return mappedRecords;
  } catch (error) {
    console.error('Error parsing curriculum CSV:', error);
    return [];
  }
}

/**
 * Generate TypeScript curriculum library from CSV data
 */
export function generateCurriculumLibrary(csvFilePath: string): string {
  const records = parseCurriculumCSV(csvFilePath);
  
  let output = `/**
 * Australian Curriculum Library - Generated from ACARA CSV Data
 * Generated on: ${new Date().toISOString()}
 */

export interface CurriculumCode {
  code: string;
  subject: string;
  yearLevel: string;
  description: string;
  strand?: string;
  elaborations?: string;
}

export const CURRICULUM_LIBRARY: Record<string, CurriculumCode> = {\n`;

  records.forEach((record, index) => {
    // Skip records with missing essential data
    if (!record.code || !record.subject || !record.yearLevel || !record.description) {
      console.log(`⚠️  Skipping record ${index + 1}: missing essential data`, {
        code: record.code,
        subject: record.subject,
        yearLevel: record.yearLevel,
        hasDescription: !!record.description
      });
      return;
    }

    const strandText = record.strand ? `\n    strand: '${String(record.strand).replace(/'/g, "\\'")}',` : '';
    const elaborationsText = record.elaborations ? `\n    elaborations: '${String(record.elaborations).replace(/'/g, "\\'")}',` : '';
    
    output += `  '${record.code}': {
    code: '${record.code}',
    subject: '${String(record.subject).replace(/'/g, "\\'")}',
    yearLevel: '${String(record.yearLevel).replace(/'/g, "\\'")}',
    description: '${String(record.description).replace(/'/g, "\\'").replace(/\n/g, ' ')}',${strandText}${elaborationsText}
  },\n`;
  });

  output += `};

/**
 * Get curriculum description for a given code
 */
export function getCurriculumDescription(code: string): string {
  const curriculum = CURRICULUM_LIBRARY[code];
  
  if (!curriculum) {
    return \`Australian Curriculum code \${code} - Please refer to www.australiancurriculum.edu.au for full details\`;
  }
  
  const strandText = curriculum.strand ? \` (\${curriculum.strand})\` : '';
  return \`\${curriculum.subject} (\${curriculum.yearLevel})\${strandText} - \${curriculum.description}\`;
}

/**
 * Get full curriculum details for a given code
 */
export function getCurriculumDetails(code: string): CurriculumCode | null {
  return CURRICULUM_LIBRARY[code] || null;
}

/**
 * Search curriculum codes by subject
 */
export function getCurriculumBySubject(subject: string): CurriculumCode[] {
  return Object.values(CURRICULUM_LIBRARY).filter(
    curriculum => curriculum.subject.toLowerCase().includes(subject.toLowerCase())
  );
}

/**
 * Search curriculum codes by year level
 */
export function getCurriculumByYear(yearLevel: string): CurriculumCode[] {
  return Object.values(CURRICULUM_LIBRARY).filter(
    curriculum => curriculum.yearLevel.toLowerCase().includes(yearLevel.toLowerCase())
  );
}

/**
 * Get all available subjects
 */
export function getAllSubjects(): string[] {
  const subjects = new Set(Object.values(CURRICULUM_LIBRARY).map(c => c.subject));
  return Array.from(subjects).sort();
}

/**
 * Get all available year levels
 */
export function getAllYearLevels(): string[] {
  const years = new Set(Object.values(CURRICULUM_LIBRARY).map(c => c.yearLevel));
  return Array.from(years).sort();
}`;

  return output;
}

/**
 * Build script to regenerate curriculum library from CSV
 */
export function buildCurriculumLibrary() {
  // Look for the main learning areas CSV file
  const csvPath = path.join(__dirname, '../data/australian-curriculum/australian-curriculum(Learning areas).csv');
  const outputPath = path.join(__dirname, '../../../client/src/utils/curriculumLibrary.ts');
  
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found at:', csvPath);
    console.log('Please ensure the Australian Curriculum export is in /server/src/data/australian-curriculum/');
    console.log('Looking for: australian-curriculum(Learning areas).csv');
    return;
  }
  
  console.log('📂 Found curriculum file:', path.basename(csvPath));
  
  const libraryCode = generateCurriculumLibrary(csvPath);
  fs.writeFileSync(outputPath, libraryCode);
  
  console.log('✅ Curriculum library generated successfully!');
  console.log(`📁 Output: ${outputPath}`);
  console.log(`📊 Records processed: ${parseCurriculumCSV(csvPath).length}`);
}
