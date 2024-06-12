module.exports = {
  root: true,
  extends: ['@mpxjs/eslint-config-ts', 'eslint-config-prettier'],
  rules: {
    // .mpx文件规则 https://mpx-ecology.github.io/eslint-plugin-mpx/rules/
  },
  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        // .ts文件规则 https://typescript-eslint.io/rules/
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: ['**/*.js'],
      rules: {
        // .js文件规则 https://eslint.bootcss.com/docs/rules/
      },
    },
  ],
}
