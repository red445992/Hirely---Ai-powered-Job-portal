// ESLint configuration - DISABLED for development
// Uncomment below to re-enable ESLint

/*
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  
  // Global ignores
  globalIgnores([
    ".next/**",
    "out/**", 
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "public/**",
    "*.config.js",
    "*.config.ts",
    ".env*",
  ]),
  
  // Custom rules to reduce common errors
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "off",
    }
  }
]);

export default eslintConfig;
*/

// Completely disable ESLint
export default [];
