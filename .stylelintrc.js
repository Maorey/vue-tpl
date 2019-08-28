/*
 * @Description: 样式代码风格定义
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
// see: https://github.com/stylelint/stylelint/blob/master/docs/user-guide/rules.md
module.exports = {
  extends: 'stylelint-config-standard',
  plugins: ['stylelint-order'],
  rules: {
    indentation: 2,
    'color-hex-case': 'lower',
    'color-hex-length': 'long',
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['include', 'extend', 'mixin'],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local'],
      },
    ],
    'font-family-no-missing-generic-family-keyword': null,
  },
}
