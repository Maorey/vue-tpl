/*
 * @Description: tsx 申明
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-11 14:15:30
 */
import Vue, { VNode } from 'vue'

// 异步组件怎么shim啊啊啊

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
