/*
 * @Description: ECharts适配
 * @Author: 毛瑞
 * @Date: 2019-07-31 15:13:54
 */
import echarts from 'echarts/lib/echarts'

// import CONFIG from '@/config'
import { get } from '@/skin'
import { isFn } from '@/utils'
import { on } from '@/utils/eventBus'
import { throttle } from '@/utils/performance'
// import { watch, unWatch, run } from '@/utils/watch'
import registerTheme from '@/skin/echarts'

registerTheme(echarts)

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

        if (isFn(args[0])) {
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
      if (isFn(args[0])) {
        args = [...args]
        args[0] = args[0]()
      }
      orginSetOption.apply(instance, args)
    }
  }

  idMap = newIdMap
})

/// 响应窗口大小改变 ///
window.addEventListener(
  'resize',
  throttle(() => {
    let id
    let instance
    for (id in idMap) {
      ;(instance = (echarts as any).getInstanceById(id)) && instance.resize()
    }
  }, 250)
)

/** echarts实例会因主题切换而改变,请使用echarts.getInstanceByDom获取实例
 */
export default echarts
