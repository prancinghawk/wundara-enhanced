import React from 'react';
import { Button } from '../ui/components/button/common-button/Button';
import { MdDownload, MdPrint, MdShare } from 'react-icons/md';

interface ExportButtonProps {
  markdownContent: string;
  planTitle: string;
  className?: string;
}

export function ExportButton({ markdownContent, planTitle, className = '' }: ExportButtonProps) {
  const handleExportMarkdown = () => {
    // Download as .md file
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${planTitle.replace(/\s+/g, '-').toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    // Create a clean HTML version for PDF export
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${planTitle}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
          }
          h1 { color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
          h2 { color: #1f2937; margin-top: 30px; }
          h3 { color: #374151; }
          .emoji { font-size: 1.2em; }
          .activity { 
            background: #f9fafb; 
            padding: 15px; 
            margin: 15px 0; 
            border-left: 4px solid #2563eb;
            border-radius: 4px;
          }
          .materials, .steps { margin: 10px 0; }
          .materials ul, .steps ol { margin: 5px 0 5px 20px; }
          .declarative { 
            background: #ecfdf5; 
            padding: 10px; 
            border-radius: 4px; 
            font-style: italic;
            border-left: 3px solid #10b981;
          }
          .adult-tip { 
            background: #fef3c7; 
            padding: 10px; 
            border-radius: 4px;
            border-left: 3px solid #f59e0b;
          }
          @media print {
            body { margin: 0; padding: 15px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${markdownToHTML(markdownContent)}
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    
    if (newWindow) {
      newWindow.onload = () => {
        setTimeout(() => {
          newWindow.print();
          newWindow.close();
          URL.revokeObjectURL(url);
        }, 500);
      };
    }
  };

  const handlePrint = () => {
    // Print current page with print-friendly styles
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: planTitle,
          text: `Check out this learning plan: ${planTitle}`,
          files: [new File([markdownContent], `${planTitle.replace(/\s+/g, '-').toLowerCase()}.md`, {
            type: 'text/markdown'
          })]
        });
      } catch (error) {
        console.log('Error sharing:', error);
        // Fallback to copy to clipboard
        handleCopyToClipboard();
      }
    } else {
      // Fallback for browsers without Web Share API
      handleCopyToClipboard();
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      // You might want to show a toast notification here
      alert('Plan copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outlined"
        iconLeft={<MdDownload size={16} />}
        text="Download"
        onClick={handleExportMarkdown}
        title="Download as Markdown file"
      />
      
      <Button
        variant="outlined"
        iconLeft={<MdPrint size={16} />}
        text="Print"
        onClick={handlePrint}
        title="Print this plan"
        className="no-print"
      />
      
      <Button
        variant="outlined"
        iconLeft={<MdShare size={16} />}
        text="Share"
        onClick={handleShare}
        title="Share this plan"
        className="no-print"
      />
    </div>
  );
}

// Helper function to convert markdown to HTML for PDF export
function markdownToHTML(markdown: string): string {
  return markdown
    // Headers
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Lists
    .replace(/^\d+\.\s+(.*$)/gm, '<li>$1</li>')
    .replace(/^[-*]\s+(.*$)/gm, '<li>$1</li>')
    
    // Wrap consecutive list items
    .replace(/(<li>.*<\/li>\s*)+/gs, (match) => {
      if (match.includes('1.')) {
        return `<ol>${match}</ol>`;
      } else {
        return `<ul>${match}</ul>`;
      }
    })
    
    // Special sections
    .replace(/🌱\s*\*"([^"]+)"\*/g, '<div class="declarative">🌱 "$1"</div>')
    .replace(/\*\*Adult Prep Tip\*\*:\s*([^\n]+)/g, '<div class="adult-tip"><strong>Adult Prep Tip:</strong> $1</div>')
    
    // Activity sections
    .replace(/### 🧩 \*\*(\d+\.\s+[^*]+)\*\*/g, '<div class="activity"><h3>🧩 $1</h3>')
    .replace(/🎯\s*\*([^*]+)\*/g, '<p><strong>🎯 Curriculum:</strong> <em>$1</em></p>')
    .replace(/🧠\s*\*Objective\*:\s*([^\n]+)/g, '<p><strong>🧠 Objective:</strong> $1</p>')
    .replace(/\*\*Materials\*\*:\s*([^\n]+)/g, '<div class="materials"><strong>Materials:</strong> $1</div>')
    .replace(/\*\*Step-by-Step\*\*:/g, '<div class="steps"><strong>Step-by-Step:</strong>')
    
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    
    // Wrap in paragraphs
    .replace(/^(?!<[h|d|u|o])/gm, '<p>')
    .replace(/(?<!>)$/gm, '</p>')
    
    // Clean up extra paragraph tags
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[h|d|u|o][^>]*>)/g, '$1')
    .replace(/(<\/[h|d|u|o][^>]*>)<\/p>/g, '$1');
}
