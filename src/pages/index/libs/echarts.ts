/*
 * @Description: 统一设置ECharts皮肤等
 * @Author: 毛瑞
 * @Date: 2019-07-31 15:13:54
 */
// import { ECharts } from 'echarts' // 类型申明 ┐(：´ゞ｀)┌
import echarts from 'echarts/lib/echarts'
// import CONFIG from '@/config'
import { get } from '@/utils/skin'
import { on } from '@/utils/eventBus'
// import { watch, unWatch, run } from '@/utils/watch'

/// 注册皮肤 (应与皮肤名一致 echarts内置:default/light/dark) ///
// echarts.registerTheme('light', {
//   // 自带皮肤 light 的颜色, 定制皮肤: https://echarts.baidu.com/theme-builder/
//   color: [
//     '#37A2DA',
//     '#32C5E9',
//     '#67E0E3',
//     '#9FE6B8',
//     '#FFDB5C',
//     '#ff9f7f',
//     '#fb7293',
//     '#E062AE',
//     '#E690D1',
//     '#e7bcf3',
//     '#9d96f5',
//     '#8378EA',
//     '#96BFFF',
//   ],
// })

// const idSet = new Set<string>()
// const instanceSet = new WeakSet()
let idMap: IObject<1> = {}
/// hack init 方法 ///
const orginInit = echarts.init
echarts.init = function(dom: any, theme?: string | IObject, opts?: IObject) {
  let instance: any = echarts.getInstanceByDom(dom)
  if (instance) {
    delete idMap[instance.id]
    instance.dispose()
  }

  instance = orginInit.call(this, dom, theme || get(), opts)
  instance.$ = opts

  idMap[instance.id] = 1

  return instance
}
// 定时清理
// setInterval(() => {
//   for (const id of idSet) {
//     instanceSet.has(echarts.getInstanceById(id)) || idSet.delete(id)
//   }
// }, CONFIG.apiCacheAlive << 3)

/// 监听皮肤改变 ///
on(process.env.SKIN_FIELD, skin => {
  const newIdMap: IObject<1> = {}

  let instance: any
  let option
  let opts
  let id
  for (id in idMap) {
    if ((instance = (echarts as any).getInstanceById(id))) {
      id = instance.getDom()
      opts = instance.$
      option = instance.getOption()
      instance.dispose()

      instance = orginInit.call(echarts, id, skin, opts)
      instance.setOption(option)
      instance.$ = opts

      newIdMap[instance.id] = 1
    }
  }

  idMap = newIdMap
})

/** echarts实例会因主题切换而改变,请使用echarts.getInstanceByDom获取实例
 */
export default echarts
