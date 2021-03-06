/** SPA 配置 */
export default {
  /*! 【↓ history路由必须绝对路径 ↓】 */
  /*! 网站路径 */
  /** 网站路径 */
  base: '',

  /*! 接口地址 */
  /** 接口地址 */
  baseUrl: process.env.BASE_PATH,
  /*! 【↑ history路由必须绝对路径 ↑】 */

  /*! 图表重绘间隔(ms) */
  /** 图表重绘间隔(ms)
   */
  redraw: 10000,

  /*! 接口刷新间隔(ms) */
  /** 接口刷新间隔(ms)
   */
  ajax: 300000,
}
