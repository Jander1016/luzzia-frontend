import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**", 
      "build/**",
      "dist/**",
      "next-env.d.ts",
      "test-*.js",
      "test-*.mjs",
      "**/*.test.js",
      "**/*.spec.js",
      ".next/types/**",
      "**/.next/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
     rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { 
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_' 
      }],
    },
  },
];

export default eslintConfig;
