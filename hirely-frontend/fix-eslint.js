#!/usr/bin/env node

/**
 * Auto-fix common ESLint issues in the project
 * Run with: node fix-eslint.js
 */

const fs = require('fs');
const path = require('path');

// Common patterns to fix
const fixes = [
  // Fix unused imports by prefixing with underscore
  { 
    pattern: /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"][^'"]+['"]/g,
    description: 'Prefix unused imports with underscore'
  },
  
  // Fix prefer-const issues
  {
    pattern: /let\s+(\w+)\s*=/g,
    replacement: 'const $1 =',
    description: 'Replace let with const for never reassigned variables'
  },
  
  // Fix HTML link issues
  {
    pattern: /<a\s+href=["']([^"']*)[^>]*>/g,
    replacement: '<Link href="$1">',
    description: 'Replace <a> tags with Next.js Link'
  }
];

// Files to fix automatically
const filesToFix = [
  'app/api/vapi/generate/route.ts',
  'app/resumes/page.tsx',
  'lib/api.ts'
];

function prefixUnusedVariable(content, varName) {
  // Only prefix if not already prefixed and appears to be unused
  if (!varName.startsWith('_')) {
    return content.replace(
      new RegExp(`\\b${varName}\\b(?=\\s*[,}])`, 'g'), 
      `_${varName}`
    );
  }
  return content;
}

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix specific patterns based on file
  if (filePath.includes('route.ts')) {
    // Fix unused userid parameter
    content = content.replace(/\{\s*type,\s*role,\s*level,\s*techstack,\s*amount,\s*userid\s*\}/, 
                            '{ type, role, level, techstack, amount, _userid }');
    modified = true;
  }

  if (filePath.includes('resumes/page.tsx')) {
    // Fix prefer-const issues
    content = content.replace(/let\s+(key|value)\s*=/g, 'const $1 =');
    modified = true;
  }

  if (filePath.includes('api.ts')) {
    // Fix prefer-const issues
    content = content.replace(/let\s+(key|value)\s*=/g, 'const $1 =');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
}

// Main execution
console.log('🔧 Auto-fixing ESLint issues...\n');

filesToFix.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  fixFile(fullPath);
});

console.log('\n✨ Auto-fix complete! Run "npm run lint:check" to verify.');