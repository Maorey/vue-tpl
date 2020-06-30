<!--
 * @Description: 折线图 示例
 * @Author: 毛瑞
 * @Date: 2019-07-08 16:57:33
 -->
<template>
  <div @mouseenter="update" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

import { EChartOption, ECharts } from 'echarts'
import echarts from '@/libs/echarts'
import 'echarts/lib/chart/line' // 折线图

import 'echarts/lib/component/grid' // 直角坐标系
import 'echarts/lib/component/legendScroll' // 可滚动的图例
import 'echarts/lib/component/tooltip' // 提示

import CONFIG from '@index/config'
import COLORS from '@index/scss/export/chart.scss'

const INTERVAL = CONFIG.redraw

@Component
export default class extends Vue {
  /// props ///
  @Prop() private data!: EChartOption.SeriesLine[] | null
  /// private instance attributes ///
  private interval?: number
  private chart?: ECharts
  private option?: () => EChartOption

  /// watch ///
  @Watch('data')
  private onDataChange(/* data?: EChartOption.SeriesLine[] */) {
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

    echarts.init(el as HTMLDivElement)

    this.option = () => {
      const series: EChartOption.SeriesLine[] = []
      const legend: object[] = []
      const xAxis: string[] = []

      data.forEach((seriesLine: EChartOption.SeriesLine) => {
        seriesLine = {
          type: 'line',
          areaStyle: {
            opacity: 0.3,
          },
          symbolSize: 1,
          ...seriesLine,
        }

        series.push(seriesLine)
        legend.push({
          name: seriesLine.name,
          icon: 'roundRect',
        })
        seriesLine.data &&
        seriesLine.data.forEach((item: any) => {
          xAxis.includes(item.name) || xAxis.push(item.name)
        })
      })

      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: COLORS.textMinor,
            },
          },
        },
        legend: {
          data: legend,
          bottom: '0',
          type: 'scroll',
          itemWidth: 15,
          itemHeight: 10,
          textStyle: {
            color: COLORS.textCommon,
            fontSize: 12,
          },
        },
        grid: {
          left: 15,
          top: 30,
          right: 15,
          bottom: 30,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis,
          axisLabel: {
            textStyle: {
              color: COLORS.textCommon,
            },
          },
        },
        yAxis: {
          type: 'value',
          name: '单位（%）',
          nameTextStyle: {
            color: COLORS.textMain,
          },
          axisLabel: {
            color: COLORS.textCommon,
          },
          splitLine: {
            lineStyle: {
              color: COLORS.theme,
            },
          },
          axisLine: {
            show: false,
          },
        },
        series,
      } as EChartOption
    }

    this.update()
  }

  private update() {
    const option = this.option
    const chart = echarts.getInstanceByDom(this.$el as HTMLDivElement)

    if (chart && option) {
      chart.clear()
      chart.setOption(option)

      this.clear()
      this.interval = setInterval(() => this.update(), INTERVAL)
    }
  }

  private clear() {
    clearInterval(this.interval)
  }
}
</script>
