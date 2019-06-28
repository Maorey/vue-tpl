/*
 * @Description: 样式处理（postcss插件）配置
 *  https://github.com/postcss/postcss
 * @Author: 毛瑞
 * @Date: 2018-11-09 00:55:35
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-06-18 17:27:24
 */
module.exports = {
  plugins: {
    // css样式自动修复（加兼容性前缀等）
    autoprefixer: {
      grid: true, // 自动修复grid布局
    },
  },
}
