/*
 * @Description: ts/js代码风格定义
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
const ENV = process.env.NODE_ENV === 'production' ? 'error' : 'warn'

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/recommended', // vue 代码风格预设
    '@vue/standard',
    '@vue/typescript',
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
  rules: {
    /// ESLint https://eslint.org/docs/rules/ ///
    indent: ['error', 2, { SwitchCase: 1 }], // 缩进
    semi: ['error', 'never'], // 不要句尾分号
    quotes: ['error', 'single'], // 使用单引号
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ], // 保留多行末尾逗号
    'space-before-function-paren': ['error', 'never'], // 方法名后不要空格
    'max-len': [
      'error',
      {
        code: 80,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true,
      },
    ], // 最大列数
    'max-params': ['error', 7], // function最大参数数
    'max-statements': ['error', 120], // function最大语句数
    'curly': 'error', // 控制语句不允许省略大括号
    'no-lonely-if': 'error',
    'no-dupe-else-if': 'error',
    'no-debugger': ENV,
    'no-console': [ENV, { allow: ['info', 'warn', 'error'] }],

    /// TSLint https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules ///
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ENV,
    '@typescript-eslint/class-name-casing': 'error', // 类名 PascalCase
    '@typescript-eslint/interface-name-prefix': ['error', 'always'], // 接口I开头

    /// Vue https://eslint.vuejs.org/rules/ ///
    'vue/component-name-in-template-casing': 'error',
    'vue/no-deprecated-scope-attribute': 'error',
    'vue/match-component-file-name': 'error',
    'vue/no-use-v-if-with-v-for': 'error',
    // 'vue/require-direct-export': 'error', // 不支持class语法
    'vue/valid-v-slot': 'error',
    'vue/v-slot-style': ['error', 'shorthand'],
    'vue/no-v-html': 'warn',
    'vue/eqeqeq': 'error',
  },
}
