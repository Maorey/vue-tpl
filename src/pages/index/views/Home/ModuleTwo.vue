<!--
 * @Description: 模块二
 * @Author: 毛瑞
 * @Date: 2019-07-08 12:51:49
 -->
<template>
  <div :class="$style.wrapper">
    <MoveCircle :class="$style.circle" />
    <ChartRose :data="data" />
  </div>
</template>

<script lang="ts">
import { get } from '@/utils/ajax'
import API from '@index/api'
import CONFIG from '@index/config'
import ChartRose from '@indexCom/charts/Rose'
import MoveCircle from '@indexCom/visual/Circle'

import { EChartOption } from 'echarts'
// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from 'vue-property-decorator'

// const UPPER_CASE:string|number|any[] // 常量
// const camelCase:any // 单例
// function utils() {} // 函数(无副作用)

/// name,components,directives,filters,extends,mixins ///
@Component({
  components: { ChartRose, MoveCircle },
})
export default class extends Vue {
  /// model (@Model) ///
  /// props (@Prop) ///
  /// data (private name: string = '响应式属性' // 除了undefined都会响应式) ///
  private data: EChartOption.SeriesPie | null = null
  /// private instance attributes (private name?: string // 非响应式属性) ///
  /// computed (get name() { return this.name } set name()... ///
  /// watch (@Watch) ///
  /// LifeCycle (beforeCreate/created/.../destroyed) ///
  private created() {
    this.get()
  }
  /// methods (private/public) ///
  private get() {
    get(API.chartPie)
      .then((data: any) => {
        data &&
          data.success &&
          (this.data = data.data as EChartOption.SeriesPie)
      })
      .catch(console.error)
      .finally(() => {
        // 假数据
        this.data ||
          (this.data = {
            name: '系列一',
            data: [
              { name: '甲', value: 1 },
              { name: '乙', value: 2 },
              { name: '丙', value: 3 },
              { name: '丁', value: 4 },
              { name: '戊', value: 5 },
            ],
          })
        setTimeout(() => this.get(), CONFIG.ajax)
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

  > div {
    width: 100%;
    height: 100%;
  }
}

.circle {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
