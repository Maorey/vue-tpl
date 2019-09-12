/*
 * @Description: ts/js代码风格定义
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'plugin:vue/recommended', // vue 代码风格预设
    '@vue/standard',
    '@vue/typescript',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
  rules: {
    /// 开发环境 ///
    ...(process.env.NODE_ENV === 'production' || {
      // 允许console.log、debugger
      'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
      'no-debugger': 'warn',
    }),

    /// ESLint https://eslint.org/docs/rules/ ///
    indent: ['error', 2, { SwitchCase: 1 }], // 缩进
    semi: ['error', 'never'], // 不要句尾分号
    quotes: ['error', 'single'], // 使用单引号
    'comma-dangle': ['error', 'always-multiline'], // 保留多行末尾逗号
    'space-before-function-paren': ['error', 'never'], // 方法名后不要空格
    'max-len': [
      'error',
      {
        code: 100,
        tabWidth: 2,
      },
    ], // 最大列数
    'max-params': ['error', 7], // function最大参数数
    'max-statements': ['error', 120], // function最大语句数

    /// TSLint https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules ///
    '@typescript-eslint/class-name-casing': 'error', // 类名 PascalCase
    '@typescript-eslint/interface-name-prefix': ['error', 'always'], // 接口I开头

    /// Vue https://eslint.vuejs.org/rules/ ///
    // [1]: 文档有写，但是插件还没实现
    // [2]: 不支持TypeScript
    'vue/component-name-in-template-casing': 'error',
    // 'vue/no-deprecated-scope-attribute': 'error', // [1]
    'vue/match-component-file-name': 'error',
    'vue/no-use-v-if-with-v-for': 'error',
    // 'vue/require-direct-export': 'error', // [2]
    // 'vue/valid-v-slot': 'error', // [1]
    // 'vue/v-slot-style': ['error', 'shorthand'], // [1]
    'vue/no-v-html': 'warn',
    'vue/eqeqeq': 'error',
  },
}
