module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: ["tsconfig.json", "functions/tsconfig.json"],
    sourceType: "module",
    extraFileExtensions: [".vue"],
  },
  ignorePatterns: [
    "/dist/**/*", // Ignore built files.
    "/functions/lib/**/*", // Ignore built files.
    ".eslintrc.cjs"
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "object-curly-spacing": ["error", "always"],
    "max-len": ["error", { code: 100 }],
    "require-jsdoc": ["off"],
    "indent": ["error", 2, { ignoredNodes: ["PropertyDefinition"] }],
    "vue/singleline-html-element-content-newline": [
      "error",
      {
        ignoreWhenNoAttributes: true,
        ignoreWhenEmpty: true,
        ignores: ["pre", "textarea", "button", "label", "router-link"],
      },
    ],
  },
};
