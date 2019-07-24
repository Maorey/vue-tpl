/*
 * @Description: 样式处理（postcss插件）配置
 *  https://github.com/postcss/postcss
 * @Author: 毛瑞
 * @Date: 2018-11-09 00:55:35
 */
module.exports = {
  plugins: {
    // css样式自动修复（加兼容性前缀等）
    autoprefixer: {
      grid: true, // 自动修复grid布局
    },
  },
}
