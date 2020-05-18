// 定制皮肤: https://www.echartsjs.com/theme-builder
import chalk from './chalk'

/** 注册echarts皮肤 */
export default (echarts: any) => {
  echarts.registerTheme('dark', chalk)
}
