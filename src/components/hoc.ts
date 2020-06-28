/*
 * @Description: 高阶组件工具
 * @Author: 毛瑞
 * @Date: 2019-07-02 14:32:33
 */
import Vue, { Component, AsyncComponent, RenderContext } from 'vue'

import Loading from './Loading' // 加载中
import Info from './Info' // 加载失败

import CONFIG from '@/config'
import getKey from '@/utils/getKey'

/** 组件筛选器
 * @param {RenderContext} context vue渲染上下文
 * @param {IObject<Component>} components 组件字典
 *
 * @returns {String | Component} 匹配的组件名/组件
 */
export type filter = (
  context: RenderContext,
  components?: IObject<Component>
) => string | Component | void

/** 根据is属性选择组件 */
const filterByBe: filter = context => context.props.be || context.data.attrs?.be

/** 获取选择器(函数式组件)
 * @param {IObject<Component>} components 组件字典
 * @param {filter} filter 组件筛选器
 *
 * @returns {Component} 选择器(函数式组件)
 */
function getChooser(
  components?: IObject<Component>,
  filter: filter = filterByBe
): Component {
  return {
    functional: true,
    render(h, context) {
      let Comp: any = filter(context, components)
      Comp = (components && components[Comp]) || Comp

      return Comp && h(Comp, context.data, context.children)
    },
  }
}

/** 选择器(函数式组件)
 * @prop {IObject<Component>} components 组件字典
 * @prop {filter} filter 组件筛选器
 */
const Chooser: Component = {
  functional: true,
  render(h, context) {
    const { components, filter = filterByBe } = context.props as {
      components?: IObject<Component>
      filter?: filter
    }

    let Comp: any = filter(context, components)
    Comp = (components && components[Comp]) || Comp

    return Comp && h(Comp, context.data, context.children)
  },
}

// 偶现一直在加载中的诡异状况, 原因未知, key的问题?
// function getAsync(
//   promiseFactory: () => Promise<Component | AsyncComponent>,
//   loading: Component = Loading,
//   error: Component = Info
// ): Component {
//   const asyncComponentFactory = (): AsyncComponent => () => ({
//     error, // 加载失败时
//     loading, // 加载时
//     component: promiseFactory() as any, // 目标
//     timeout: CONFIG.timeout, // 加载超时（默认Infinity）
//   })

//   const observe = Vue.observable({ c: asyncComponentFactory() })
//   const update = () => {
//     observe.c = asyncComponentFactory()
//   }

//   return {
//     functional: true,
//     render(h, { data, children }) {
//       // 保留 event: $ 用于 hack 加载失败时点击重新加载
//       data.on || (data.on = {})
//       data.on.$ = update

//       return h(observe.c, data, children)
//     },
//   }
// }

/** 异步组件加载状态 */
const enum Status {
  init = 0,
  load = 1,
  fail = 2,
  done = 3,
}
/** 获取带加载状态的【异步】组件
 * @param {Function} promiseFactory 异步组件工厂函数, 比如: () => import('a')
 *    另: import() 只会成功下载一次
 * @param {Object} config 配置
 *
 *    {
 *
 *      loading: 加载时展示的组件 默认:'com/Loading'
 *
 *      error: 加载失败展示的组件 默认:'com/Info'
 *
 *      timeout: 加载组件超时时间 默认:'/config'.timeout
 *
 *      delay: 展示loading延迟(ms) 默认:250
 *
 *    }
 *
 * @returns {Component} 组件, error、loading、目标三个组件可触发事件'$'以重新加载
 */
function getAsync(
  promiseFactory: (
    context?: RenderContext
  ) => Promise<Component | AsyncComponent>,
  config?: {
    /** 加载时展示的组件 默认:'@com/Loading' */
    loading?: Component
    /** 加载失败展示的组件 默认:'@com/Info' */
    error?: Component
    /** 加载组件超时时间 默认:'@/config'.timeout */
    timeout?: number
    /** 展示loading延迟(ms) */
    delay?: number
  }
): Component {
  config || (config = {})
  config.loading || (config.loading = Loading)
  config.error || (config.error = Info)
  config.timeout || (config.timeout = CONFIG.timeout)

  const store = Vue.observable({ s: Status.init })
  let component: Component | AsyncComponent
  let key: string | number
  let keyTimeout: number
  let keyDelay: number
  const onInit = () => {
    store.s = Status.init
  }
  const onLoad = () => {
    keyDelay = 0
    store.s === Status.init && (store.s = Status.load)
  }
  const onTimeout = () => {
    keyTimeout = 0
    if (store.s === Status.load) {
      store.s = Status.fail
      console.error('异步组件加载超时:', promiseFactory)
    }
  }
  const onFail = (err: Error) => {
    store.s = Status.fail
    console.error('异步组件加载失败:', err)
  }
  const onDone = (comp: any) => {
    component = comp.default || comp
    store.s = Status.done
  }

  // 不缓存 VNode 以刷新自身
  return {
    functional: true,
    render(h, context) {
      if (keyDelay) {
        clearTimeout(keyDelay)
        keyDelay = 0
      }
      if (keyTimeout) {
        clearTimeout(keyTimeout)
        keyTimeout = 0
      }

      const data = context.data
      ;(data.on || (data.on = {})).$ = onInit // event: $ 用于重新加载
      key || (key = data.key || (data.key = getKey())) // 防缓存导致一直加载中

      switch (store.s) {
        case Status.init:
          promiseFactory(context)
            .then(onDone)
            .catch(onFail)
          keyDelay = setTimeout(onLoad, (config as any).delay) // 延迟显示loading
          ;(config as any).timeout > 0 &&
            (keyTimeout = setTimeout(onTimeout, (config as any).timeout))
          return h('i', { style: 'display:none', key: key + 'I' })
        case Status.load:
          data.key = key + 'L'
          return h((config as any).loading, data, context.children)
        case Status.fail:
          data.key = key + 'F'
          return h((config as any).error, data, context.children)
        default:
          data.key = key
          return h(component, data, context.children)
      }
    },
  }
}

/* 示例1: 从指定组件中选择 (自由度高于 <Component /> )
<template>
  <Transition name="fade">
    <KeepAlive>
      <Chooser :be="be" :type="type"/>
    </KeepAlive>
  </Transition>
</template>

<script lang="ts">
import A from 'A'
import B from 'B'
const Chooser = getChooser({ A, B }) // 使用默认过滤器
const Chooser = getChooser(
  { A, B },
  (context: any): string => context.data.attrs.type || context.props.type
  ) // 自定义过滤器
const Chooser = getChooser({
  A,
  B: getChooser(
    { A, B },
    (context: any): string => context.data.attrs.type || context.props.type
  ),
 }) // 嵌套: 第一层使用默认过滤器的is属性, 第二层使用自定义的type属性

@Component({ components: { Chooser } })
export default class extends Vue {
  get be() {
    return 'B'
  }
  get type() {
    return 'A'
  }
}
</script>
*/

/* 示例2: 使用带加载状态的异步组件
<template>
  <AsyncComponent />
</template>

<script lang="ts">
@Component({
  components: {
    // 按规范命名哈 (多个异步组件合并到一个chunk用一样的名字)
    AsyncComponent: getAsync(/* webpackChunkName: "ocA" * / () => import('A')),
  },
})
export default class extends Vue {}
</script>
*/

/* 示例3: (・ω<) 组合1: 切换异步组件
<template>
  <Transition name="fade">
    <KeepAlive>
      <Chooser :be="be"/>
    </KeepAlive>
  </Transition>
</template>

<script lang="ts">
const Chooser = getChooser({
  A: getAsync(/* webpackChunkName: "oCom" * /() => import('A')),
  B: getAsync(/* webpackChunkName: "oCom" * / () => import('B')),
})

@Component({ components: { Chooser } })
export default class extends Vue {
  get be() {
    return 'A'
  }
}
</script>

组合2: 异步的高阶选择组件
// Chooser/index.ts
import A from 'A'
import B from 'B'
const Chooser = getChooser({ A, B }) // 使用默认过滤器

export default Chooser // 异步加载的时候必须是default

// SomeComponent.vue
<template>
  <AsyncComponent :be="be"/>
</template>

<script lang="ts">
@Component({
  components: {
    AsyncComponent:
      getAsync(/* webpackChunkName: "ocChooser" * / () => import('Chooser')),
  },
})
export default class extends Vue {
  get be() {
    return 'A'
  }
}
</script>
*/
// 更多...

export { Chooser as default, filterByBe as filter, getChooser, getAsync }
