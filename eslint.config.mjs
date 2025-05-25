import stylistic from "@stylistic/eslint-plugin";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
    {
        files: ["**/*.ts"], // Target TypeScript files
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.eslint.json",
                tsconfigRootDir: process.cwd(),
                warnOnUnsupportedTypeScriptVersion: false,
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            "@stylistic": stylistic,
        },
        rules: {
            curly: ["warn", "multi-line"],
            "prefer-arrow-callback": "warn",
            "prefer-template": "warn",
            yoda: ["error", "never", { onlyEquality: true }],
            eqeqeq: "error",
            "@stylistic/arrow-parens": ["warn", "as-needed"],
            "@stylistic/brace-style": ["warn", "1tbs", { allowSingleLine: true }],
            "@stylistic/indent": ["warn", 4, { SwitchCase: 1 }],
            "@stylistic/linebreak-style": [
                "warn",
                process.platform === "win32" ? "windows" : "unix",
            ],
            "@stylistic/quotes": ["warn", "double", { avoidEscape: true }],
            "@typescript-eslint/array-type": ["warn", { default: "array-simple" }],
            "@typescript-eslint/no-unused-vars": [
                "error",
                { vars: "all", args: "none" },
            ],
            // Disabled rules (for clarity)
            "@typescript-eslint/no-confusing-void-expression": "off",
            "@typescript-eslint/consistent-type-definitions": "off",
        },
    },
    {
        ignores: [
            "eslint.config.mjs",
            "dist/**/*",
            "node_modules/**/*",
        ],
    },
];