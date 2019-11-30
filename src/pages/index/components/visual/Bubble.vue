<!--
 * @Description: 泡泡
 * @Author: 毛瑞
 * @Date: 2019-08-01 09:15:49
 -->
<template>
  <canvas @mousemove="move" />
</template>

<script lang="ts">
import { getOffset } from '@/utils/dom'

// see: https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from 'vue-property-decorator'

/// 按需引入d3 ///
import {
  range,
  schemeCategory10,
  forceSimulation,
  forceCollide,
  SimulationNodeDatum,
} from 'd3'

/// name,components,directives,filters,extends,mixins ///
@Component
export default class extends Vue {
  /// model (@Model) ///
  /// props (@Prop) ///
  /// data (private name: string = '响应式属性' // 除了undefined都会响应式) ///
  /// private instance attributes (private name?: string // 非响应式属性) ///
  private root?: any
  private sim?: any // Simulation 定义与d3暴露的一致 ┐(：´ゞ｀)┌
  private offset?: any
  /// computed (get name() { return this.name } set name()... ///
  /// watch (@Watch) ///
  /// LifeCycle (private beforeCreate/created/.../destroyed) ///
  private mounted() {
    const canvas = this.$el as HTMLCanvasElement
    const context = canvas.getContext('2d')
    const width = (canvas.width = canvas.clientWidth)
    const height = (canvas.height = canvas.clientHeight)
    const halfWidth = width / 2
    const halfHeight = height / 2
    const tau = 2 * Math.PI

    const nodes = range(200).map((i: number) => ({
      r: Math.random() * 14 + 4, // 半径
      c: schemeCategory10[i % 10], // 颜色
      x: NaN,
      y: NaN,
    }))
    this.root = nodes[0]
    this.root.c = '#0000'

    this.sim = forceSimulation(nodes)
      .force(
        'collide',
        forceCollide()
          .radius((node: any) => node.r)
          .iterations(2)
      )
      .on('tick', () => {
        if (!context) {
          return
        }

        context.clearRect(0, 0, width, height)
        context.save()
        context.translate(halfWidth, halfHeight)

        nodes.forEach((node) => {
          context.beginPath()
          context.moveTo(node.x + node.r, node.y)
          context.arc(node.x, node.y, node.r, 0, tau)
          context.fillStyle = node.c
          context.fill()
          context.closePath()
        })

        context.restore()
      })

    const offset: any = getOffset(canvas)
    offset.left += halfWidth
    offset.top += halfHeight
    this.offset = offset
  }

  /// methods (private/public) ///
  private move(event: MouseEvent) {
    const root = this.root as SimulationNodeDatum
    if (root) {
      const offset = this.offset
      root.fx = event.clientX - offset.left
      root.fy = event.clientY - offset.top
      this.sim.restart()
    }
  }
  /// render ///
}
</script>
