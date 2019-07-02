/*
 * @Description: babel 转码配置 https://babeljs.io/docs/en/
 *
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-02 09:42:45
 */
module.exports = {
  presets: ['@vue/app'], // https://cli.vuejs.org/zh/config/#babel
  plugins: [
    // 'transform-decorators', // https://babeljs.io/docs/en/babel-plugin-proposal-decorators
    // ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
    // '@babel/plugin-proposal-class-properties',
    // polyfill 工具 https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 2, // 用3.x vue 部分不兼容...
        helpers: false,
      },
    ],
  ],
}
