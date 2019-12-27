/*
 * @Description: 统一设置ECharts皮肤等
 * @Author: 毛瑞
 * @Date: 2019-07-31 15:13:54
 */
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
let idMap: IObject<IArguments> = {}
/// hack 方法 ///
let orginSetOption: Function
const orginInit = echarts.init
echarts.init = function(dom: any, theme?: string | IObject, opts?: IObject) {
  const instance = orginInit.call(this, dom, theme || get(), opts)
  ;(instance as any).$ = opts

  if (!orginSetOption) {
    try {
      const echartsProto = Object.getPrototypeOf(instance)
      orginSetOption = echartsProto.setOption
      echartsProto.setOption = function() {
        let args: IArguments | any[] = arguments
        idMap[this.id] = args

        if (typeof args[0] === 'function') {
          args = [...args]
          args[0] = args[0]()
        }

        return orginSetOption.apply(this, args)
      }
    } catch (error) {}
  }

  return instance
}
// 定时清理
// setInterval(() => {
//   for (const id of idSet) {
//     instanceSet.has((echarts as any).getInstanceById(id)) || idSet.delete(id)
//   }
// }, CONFIG.apiCacheAlive << 3)

/// 监听皮肤改变 ///
on(process.env.SKIN_FIELD, skin => {
  const newIdMap: IObject<IArguments> = {}

  let instance
  let args
  let opts
  let id
  for (id in idMap) {
    if ((instance = (echarts as any).getInstanceById(id))) {
      args = idMap[id]
      opts = (instance as any).$
      id = instance.getDom()
      instance.dispose()

      instance = echarts.init(id, skin, opts)
      newIdMap[(instance as any).id] = args
      if (typeof args[0] === 'function') {
        args = [...args]
        args[0] = args[0]()
      }
      orginSetOption.apply(instance, args)
    }
  }

  idMap = newIdMap
})

/// 响应窗口大小改变 ///
window.addEventListener('resize', () => {
  let id
  let instance
  for (id in idMap) {
    ;(instance = (echarts as any).getInstanceById(id)) && instance.resize()
  }
})

/** echarts实例会因主题切换而改变,请使用echarts.getInstanceByDom获取实例
 */
export default echarts
