/*
 * @Description: 统一设置ECharts主题等
 * @Author: 毛瑞
 * @Date: 2019-07-31 15:13:54
 */
// import { ECharts } from 'echarts' // 类型申明 ┐(：´ゞ｀)┌
import echarts from 'echarts/lib/echarts'

// import SKIN from '@/utils/skin' // 随皮肤改变...

/// 注册主题 ///
echarts.registerTheme('tpl', {
  // 自带主题 light 的颜色, 定制主题: https://echarts.baidu.com/theme-builder/
  color: [
    '#37A2DA',
    '#32C5E9',
    '#67E0E3',
    '#9FE6B8',
    '#FFDB5C',
    '#ff9f7f',
    '#fb7293',
    '#E062AE',
    '#E690D1',
    '#e7bcf3',
    '#9d96f5',
    '#8378EA',
    '#96BFFF',
  ],
})

export default echarts
