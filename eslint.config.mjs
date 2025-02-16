import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";


export default [
  eslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",  // Allow console.log without errors
        window: "readonly",   // Allow browser globals
        document: "readonly",
        process: "readonly"   // Allow Node.js globals
      }
    },
    plugins: {
      "react": reactPlugin,
      "react-hooks": reactHooks,
      "import": importPlugin
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "import/no-unresolved": "error",
      "import/order": [
        "error",
        {
          "groups": ["builtin", "external", "internal"],
          "alphabetize": { "order": "asc", "caseInsensitive": true }
        }
      ]
    },
    settings: {
      react: {
        version: "detect" // Auto-detect React version
      }
    }
  }
];
