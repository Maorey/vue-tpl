/*
 * @Description: 代码风格定义
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-02 11:15:45
 */
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'plugin:vue/strongly-recommended', // vue <template/>代码风格预设
    '@vue/standard',
    '@vue/typescript',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  rules: {
    /// 开发环境 ///
    ...(process.env.NODE_ENV === 'production' || {
      // 允许console.log、debugger
      'no-console': 0,
      'no-debugger': 0,
    }),

    /// ESLint https://eslint.org/docs/rules/ ///
    semi: [2, 'never'], // 不要句尾分号
    quotes: [2, 'single'], // 使用单引号
    'comma-dangle': [2, 'always-multiline'], // 保留多行末尾逗号
    'space-before-function-paren': [2, 'never'], // 方法名后不要空格

    /// vue https://eslint.vuejs.org/rules/ ///
  },
}
