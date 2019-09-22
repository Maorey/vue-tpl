/** 根据指定scss变量文件生成多套对应主题
 */

const PLUGIN_NAME = 'theme-scss-var' // 插件名

module.exports = class {
  /**
   * @param {Object} option 选项
   *  {
   *    dir: 主题文件夹
   *  }
   */
  constructor(option = {}) {
    this._dir = option.dir
  }

  // https://webpack.docschina.org/api/plugins/
  apply(compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, callback) => {})
  }
}
