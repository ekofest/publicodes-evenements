module.exports = {
  root: true,
  env: { node: true, commonjs: true, browser: true, es2020: true },
  extends: "eslint:recommended",
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
}
