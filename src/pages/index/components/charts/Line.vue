<!--
 * @Description: 折线图 示例
 * @Author: 毛瑞
 * @Date: 2019-07-08 16:57:33
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-12 12:29:08
 -->
<template>
  <div @mouseenter="refresh" />
</template>

<script lang="ts">
import CONFIG from '@index/config'

import echarts from 'echarts/lib/echarts'
import { EChartOption, ECharts } from 'echarts'
import 'echarts/lib/chart/line' // 折线图

import 'echarts/lib/component/grid' // 直角坐标系
import 'echarts/lib/component/legendScroll' // 可滚动的图例
import 'echarts/lib/component/tooltip' // 提示

import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

const INTERVAL = CONFIG.redraw

@Component
export default class extends Vue {
  /// props ///
  @Prop() private data!: EChartOption
  /// private instance attributes ///
  private interval?: number
  private chart?: ECharts
  private option?: EChartOption

  /// watch ///
  @Watch('data')
  private onDataChange(data: EChartOption | void) {
    this.init()
  }

  /// Lifecycle ///
  private mounted() {
    this.init()
  }
  private destroyed() {
    this.clear()
  }

  /// methods ///
  private init() {
    this.clear()

    const el = this.$el
    const data = this.data

    if (!el || !data) {
      return
    }
    this.chart || (this.chart = echarts.init(el as HTMLDivElement))

    this.option = data

    this.refresh()
  }

  private refresh() {
    const chart = this.chart
    const option = this.option

    if (chart && option) {
      chart.clear()
      chart.setOption(option)

      this.clear()
      this.interval = setInterval(() => this.refresh(), INTERVAL)
    }
  }
  private clear() {
    clearInterval(this.interval)
  }
}
</script>
