<!--
 * @Description: 模块一
 * @Author: 毛瑞
 * @Date: 2019-07-08 12:51:49
 -->
<template>
  <ChartLine
    :class="$style.wrapper"
    :data="data"
  />
</template>

<script lang="ts">
import { get } from '@/utils/ajax'
import API from '@index/api'
import CONFIG from '@index/config'
import ChartLine from '@indexCom/charts/Line'

import { EChartOption } from 'echarts'
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from 'vue-property-decorator'

// const UPPER_CASE:string|number|any[] // 常量
// const camelCase:any // 单例
// function utils() {} // 函数(无副作用)

/// name,components,directives,filters,extends,mixins ///
@Component({
  components: { ChartLine },
})
export default class extends Vue {
  /// model (@Model) ///
  /// props (@Prop) ///
  /// data (private name: string = '响应式属性' // 除了undefined都会响应式) ///
  private data: EChartOption.SeriesLine[] | null = null
  /// private instance attributes (private name?: string // 非响应式属性) ///
  /// computed (get name() { return this.name } set name()... ///
  /// watch (@Watch) ///
  /// LifeCycle (beforeCreate/created/.../destroyed) ///
  private created() {
    this.get()
  }
  /// methods (private/public) ///
  private get() {
    get(API.chartLine)
      .then((data: any) => {
        data &&
          data.success &&
          (this.data = data.data as EChartOption.SeriesLine[])
      })
      .catch(console.error)
      .finally(() => {
        // 假数据
        this.data ||
          (this.data = [
            {
              name: '系列一',
              data: [
                { name: 'a', value: 1 },
                { name: 'b', value: 2 },
                { name: 'c', value: 3 },
                { name: 'd', value: 4 },
                { name: 'e', value: 5 },
              ],
            },
            {
              name: '系列二',
              data: [
                { name: 'a', value: 5 },
                { name: 'b', value: 4 },
                { name: 'c', value: 3 },
                { name: 'd', value: 2 },
                { name: 'e', value: 1 },
              ],
            },
          ])
        setTimeout(() => {
          this.get()
        }, CONFIG.ajax)
      })
  }
  /// render ///
}
</script>

<style lang="scss" module>
.wrapper {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 10% 0;
}
</style>
