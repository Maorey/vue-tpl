/*
 * @Description: 样式处理（postcss插件）配置
 * @Author: 毛瑞
 * @Date: 2018-11-09 00:55:35
 */
// https://github.com/postcss/postcss
module.exports = {
  plugins: {
    // https://github.com/postcss/autoprefixer#options
    autoprefixer: {
      grid: 'autoplace',
    },
    // https://github.com/csstools/postcss-preset-env
    'postcss-preset-env': {},
  },
}
