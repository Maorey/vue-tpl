<!--
 * @Description: 玫瑰图
 * @Author: 毛瑞
 * @Date: 2019-07-31 17:02:46
 -->
<template>
  <div @mouseenter="refresh" />
</template>

<script lang="ts">
import CONFIG from '@index/config'

import { EChartOption, ECharts } from 'echarts'
import echarts from './echarts'
import 'echarts/lib/chart/pie' // 饼图

import 'echarts/lib/component/title' // 标题
import 'echarts/lib/component/tooltip' // 提示

// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

const INTERVAL = CONFIG.redraw

/// name,components,directives,filters,extends,mixins ///
@Component
export default class extends Vue {
  /// model (@Model) ///
  /// props (@Prop) ///
  @Prop() private data!: EChartOption.SeriesPie | null
  /// data (private name: string = '响应式属性' // 除了undefined都会响应式) ///
  /// private instance attributes (private name?: string // 非响应式属性) ///
  private interval?: number
  private chart?: ECharts
  private option?: object
  /// computed (get name() { return this.name } set name()... ///
  /// watch (@Watch) ///
  @Watch('data')
  private onDataChange(data?: EChartOption.SeriesPie) {
    this.init()
  }
  /// LifeCycle (beforeCreate/created/.../destroyed) ///
  private mounted() {
    this.init()
  }
  private destroyed() {
    this.clear()
  }
  /// methods (private/public) ///
  private init() {
    this.clear()

    const el = this.$el
    const data = this.data

    if (!el || !data) {
      return
    }
    this.chart || (this.chart = echarts.init(el as HTMLDivElement, 'tpl'))

    // 一些设置
    this.option = {
      title: {
        subtext: '单位: 个',
        x: 'right',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}个({d}%)',
      },
      series: {
        type: 'pie',
        roseType: 'radius',
        radius: [20, '70%'],
        ...data,
      },
    }

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
  /// render ///
}
</script>
