import fs from 'fs';
import path from 'path';

interface CurriculumDocument {
  subject: string;
  yearRange: string;
  content: string;
}

class CurriculumContextService {
  private documents: Map<string, CurriculumDocument> = new Map();
  private initialized = false;

  constructor() {
    this.loadDocuments();
  }

  private loadDocuments() {
    try {
      const acaraDir = path.join(__dirname, '../data/acara');
      
      if (!fs.existsSync(acaraDir)) {
        console.warn('ACARA documents directory not found:', acaraDir);
        return;
      }

      const files = fs.readdirSync(acaraDir).filter(file => file.endsWith('.txt'));
      
      for (const file of files) {
        const filePath = path.join(acaraDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Parse filename to extract subject and year range
        const parsed = this.parseFilename(file);
        if (parsed) {
          this.documents.set(parsed.key, {
            subject: parsed.subject,
            yearRange: parsed.yearRange,
            content
          });
          console.log(`📚 Loaded curriculum document: ${parsed.subject} (${parsed.yearRange})`);
        }
      }
      
      this.initialized = true;
      console.log(`✅ Curriculum context service initialized with ${this.documents.size} documents`);
    } catch (error) {
      console.error('Error loading curriculum documents:', error);
    }
  }

  private parseFilename(filename: string): { key: string; subject: string; yearRange: string } | null {
    // Parse filenames like "aus_curriculum_english_f6.txt" or "aus_curriculum_english_7_10.txt"
    const match = filename.match(/aus_curriculum_([a-z]+)_([f\d_]+)\.txt/i);
    if (!match) return null;

    const subject = match[1].charAt(0).toUpperCase() + match[1].slice(1);
    const yearCode = match[2];
    
    let yearRange: string;
    if (yearCode.includes('f')) {
      yearRange = 'Foundation-Year 6';
    } else if (yearCode === '7_10') {
      yearRange = 'Year 7-10';
    } else if (yearCode.includes('_')) {
      const parts = yearCode.split('_');
      yearRange = `Year ${parts[0]}-${parts[1]}`;
    } else {
      yearRange = `Year ${yearCode}`;
    }

    return {
      key: `${subject.toLowerCase()}_${yearCode}`,
      subject, // Keep original subject name (English)
      yearRange
    };
  }

  /**
   * Get detailed curriculum context for a specific year level and subject
   */
  getContextForYearLevel(yearLevel: string, subject?: string): string {
    if (!this.initialized || this.documents.size === 0) {
      return '';
    }

    // Convert year level to numeric for comparison
    const yearNum = this.extractYearNumber(yearLevel);
    
    // Find relevant documents
    const relevantDocs: CurriculumDocument[] = [];
    
    for (const doc of this.documents.values()) {
      // Check if subject matches (if specified)
      if (subject && !doc.subject.toLowerCase().includes(subject.toLowerCase())) {
        continue;
      }

      // Check if year level falls within document's range
      if (this.isYearInRange(yearNum, doc.yearRange)) {
        relevantDocs.push(doc);
      }
    }

    if (relevantDocs.length === 0) {
      return '';
    }

    // Extract relevant sections for the specific year level
    let context = `\n\n🎯 DETAILED CURRICULUM CONTEXT FOR ${yearLevel.toUpperCase()}:\n`;
    context += '=' .repeat(60) + '\n';

    for (const doc of relevantDocs) {
      const yearSection = this.extractYearSection(doc.content, yearLevel);
      if (yearSection) {
        context += `\n📖 ${doc.subject} (${doc.yearRange}):\n`;
        context += yearSection;
        context += '\n' + '-'.repeat(40) + '\n';
      }
    }

    return context;
  }

  /**
   * Extract year number from year level string
   */
  private extractYearNumber(yearLevel: string): number {
    if (yearLevel.toLowerCase().includes('foundation')) return 0;
    const match = yearLevel.match(/year\s*(\d+)/i);
    return match ? parseInt(match[1]) : 0;
  }

  /**
   * Check if a year number falls within a document's year range
   */
  private isYearInRange(yearNum: number, yearRange: string): boolean {
    if (yearRange.includes('Foundation') && yearNum <= 6) return true;
    
    const match = yearRange.match(/Year\s*(\d+)(?:-(\d+))?/i);
    if (!match) return false;
    
    const startYear = parseInt(match[1]);
    const endYear = match[2] ? parseInt(match[2]) : startYear;
    
    return yearNum >= startYear && yearNum <= endYear;
  }

  /**
   * Extract the specific year section from document content
   */
  private extractYearSection(content: string, yearLevel: string): string {
    const yearNum = this.extractYearNumber(yearLevel);
    let searchPattern: string;
    
    if (yearNum === 0) {
      searchPattern = 'Foundation Year';
    } else {
      searchPattern = `Year ${yearNum}`;
    }

    // Find the section for this year level
    const lines = content.split('\n');
    let inSection = false;
    let sectionContent = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if we're starting the relevant section
      if (line.includes(`## ${searchPattern}`) || line.includes(`# ${searchPattern}`)) {
        inSection = true;
        continue;
      }
      
      // Check if we're starting a different year section
      if (inSection && (line.match(/^##?\s+Year\s+\d+/) || line.match(/^##?\s+Foundation/))) {
        break;
      }
      
      // Collect content if we're in the right section
      if (inSection) {
        sectionContent += line + '\n';
      }
    }

    return sectionContent.trim();
  }

  /**
   * Get all available subjects
   */
  getAvailableSubjects(): string[] {
    return Array.from(new Set(Array.from(this.documents.values()).map(doc => doc.subject)));
  }

  /**
   * Get summary of loaded documents
   */
  getSummary(): string {
    if (!this.initialized) return 'Curriculum context service not initialized';
    
    const subjects = this.getAvailableSubjects();
    return `Loaded ${this.documents.size} curriculum documents covering: ${subjects.join(', ')}`;
  }
}

// Export singleton instance
export const curriculumContextService = new CurriculumContextService();
