/*
 * @Description: babel 转码配置 https://babeljs.io/docs/en/
 *
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
module.exports = {
  // https://cli.vuejs.org/zh/config/#babel
  presets: ['@vue/cli-plugin-babel/preset'],
  // plugins: [
  // 'transform-decorators', // https://babeljs.io/docs/en/babel-plugin-proposal-decorators
  // ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
  // '@babel/plugin-proposal-class-properties',
  // polyfill 工具 https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html
  // ['@babel/plugin-transform-runtime', { corejs: 3 }],
  // https://github.com/ElementUI/babel-plugin-component
  // [
  //   'component',
  //   {
  //     libraryName: 'element-ui',
  //     styleLibraryName: 'theme-chalk',
  //   },
  // ],
  // ],
  plugins: [
    // '@babel/plugin-syntax-bigint',
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-private-methods',
    // '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    // '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
}
