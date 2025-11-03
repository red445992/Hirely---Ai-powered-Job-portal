# ESLint Configuration Guide

## Current Setup
Your project uses ESLint 9+ with the new flat config system.

## Quick Fixes Applied ✅

1. **Fixed Next.js config** - Removed invalid `eslint` property
2. **Fixed InterviewCard** - Replaced `Date.now()` with default date
3. **Fixed Navbar** - Used async pattern for setState in effect
4. **Fixed API route** - Prefixed unused `userid` with underscore
5. **Fixed resumes page** - Changed `let` to `const` for loop variables

## To Disable ESLint Temporarily 🚫

### Option 1: Disable for Development
Add to `eslint.config.mjs`:
```javascript
{
  ignores: ["**/*"] // Ignores all files
}
```

### Option 2: Disable Specific Rules
Add to `eslint.config.mjs`:
```javascript
{
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/no-unescaped-entities": "off",
  }
}
```

### Option 3: Disable in VS Code
Add to `.vscode/settings.json`:
```json
{
  "eslint.enable": false
}
```

## Production ESLint Config 🎯

For production builds, keep these rules:
- `@next/next/no-html-link-for-pages` (security)
- `react-hooks/error-boundaries` (reliability)
- `@typescript-eslint/no-explicit-any` (type safety)

## Commands to Run 📋

```bash
# Check current issues
npm run lint:check

# Auto-fix what can be fixed
npm run lint

# Type check only
npm run type-check

# Build (ignores ESLint if configured)
npm run build
```

## ESLint Status Summary 📊

- ❌ **11 Errors** (mostly React patterns and links)
- ⚠️ **60 Warnings** (unused variables, type issues)
- ✅ **Critical fixes applied** (build-breaking issues resolved)

Your app should now build and run successfully! 🚀