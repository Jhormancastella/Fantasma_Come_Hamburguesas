export default [
  {
    ignores: ["node_modules/**"]
  },
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script"
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "no-redeclare": "error",
      "no-dupe-keys": "error",
      "no-unreachable": "error",
      "no-constant-condition": ["warn", { "checkLoops": false }],
      "eqeqeq": ["warn", "always"],
      "curly": ["warn", "all"]
    }
  }
];
