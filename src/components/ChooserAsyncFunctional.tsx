/**
 * @Description: 组件选择器(异步) 比如: Ajax完成后才知道该使用哪个组件 暂不提供工厂函数
 * @Author: 毛瑞
 * @Date: 2020-01-02 16:13:36
 */
import Vue, { Component, RenderContext, VNode } from 'vue'

/// [import] vue组件,其他,CSS Module ///
// import { getAsync } from '@com/hoc'
// import STYLE from './index.module.scss'
import Info from './Info'
import Loading from './Loading'

import { hasOwn, isDef, isFn, isEqual } from '@/utils'
import clone from '@/utils/clone'
import { setHook } from '@/libs/vue'

/// 常量(UPPER_CASE),单例/变量(camelCase),函数(无副作用,camelCase) ///
// const ModuleOne: any = getAsync(() =>
//  import(/* webpackChunkName: "ihOne" */ './ModuleOne')
// )
/** 加载状态, 同时键名也是支持的事件/slot */
export const enum status {
  none = 1,
  loading = 2,
  error = 3,
  empty = 4,
  success = 5,
}
export type component = status | string | Component
export type filter =
  | ((data: any) => { data: any; comp: component })
  | ((data: any) => any)
type hook = (context: RenderContext, data: any) => any
type hooks = hook | hook[]
export interface IStore {
  /// props ///
  /** 查询函数 diff:fetch,args ? fetch.apply(store, args) */
  fetch?: (...args: any[]) => Promise<any>
  /** 查询函数参数列表 */
  args?: any[]
  /** 查询函数 get.call(store), 同 (fetch + args) */
  get?: () => Promise<any>
  /** 查询错误处理 store.error(err) */
  error?: status | ((err?: Error) => component)
  /** 未匹配到任何组件但有数据时使用的组件[默认div] */
  tag?: component
  /** 数据&组件筛选 store.filter(data) */
  filter?: filter
  /** 组件字典[优先使用] */
  components?: { [name: string]: component }
  /** 类似 v-once, true:上述props未发生变化则[不重新渲染],此时slot将不响应外部状态改变 */
  once?: boolean

  /// 私有属性 ///
  /** Vue响应式数据 */
  i: {
    /** 当前组件 */
    i: component
    /** 父/此组件是否失活/离开 */
    d: 0 | 1
  }
  /** hooks */
  h: {
    /** 重新加载 */
    $: () => void
    /** 父/此组件 activated */
    a: () => void
    /** 父/此组件 deactivated */
    d: () => void
    // /** 父组件 beforeDestroy */
    // e: () => void
  }
  /** 触发的事件: status 枚举 */
  f?: { [event in status]?: hooks }
  /** 1:get 2:(fetch + args) */
  g?: false | 1 | 2
  /** 原始响应 */
  o?: any
  /** 绑定的 props.data */
  d?: any
  /** 上一次组件(once时比较) */
  c?: component
  /** 当前组件VNode */
  n?: VNode
}

/** 状态-名称 映射 */
export const MAP: { [key in status]?: string } = {
  [status.none]: 'none',
  [status.loading]: 'loading',
  [status.error]: 'error',
  [status.empty]: 'empty',
}

function updateState(store: IStore) {
  let data = store.o
  if (isDef(data)) {
    const DIC = store.components
    const DEFAULT_TAG = 'div'
    if (isFn(store.filter)) {
      if (isDef((data = store.filter(data)))) {
        store.d = { data: data.data || data }
        store.i.i =
          (DIC && DIC[data.comp]) || data.comp || store.tag || DEFAULT_TAG
      } else {
        store.i.i = status.empty
      }
    } else {
      store.d = { data }
      store.i.i = (DIC && DIC[store.tag as string]) || store.tag || DEFAULT_TAG
    }
  } else {
    store.i.i = status.empty
  }
}
function fetchData(store: IStore) {
  function onError(err?: Error) {
    store.i.i =
      (isFn(store.error) ? store.error(err) : store.error) || status.error
  }
  if (store.g) {
    store.i.i = status.loading
    ;(store.g > 1
      ? (store as any).fetch.apply(store, store.args as any[])
      : (store as any).get()
    )
      .then((data: any) => {
        store.o = data
        updateState(store)
      })
      .catch(onError)
  } else if (store.error) {
    onError()
  } else {
    store.o = 1 // 兼容同步
    updateState(store)
  }
}
const activated = 'hook:activated'
const deactivated = 'hook:deactivated'
const beforeDestroy = 'hook:beforeDestroy'
function getStore(vm: Vue, key: any) {
  const CACHE = (vm as any)._$c || ((vm as any)._$c = {})
  let store: IStore = CACHE[key]
  if (!store) {
    store = CACHE[key] = {
      i: Vue.observable({ i: status.loading, d: 0 as 0 }),
      h: {
        $: () => {
          fetchData(store)
        },
        a: () => {
          store.i.d = 0
        },
        d: () => {
          store.i.d = 1
        },
      },
    }

    // LifeCycle hooks for parent
    vm.$on(activated, store.h.a)
    vm.$on(deactivated, store.h.d)
    vm.$once(beforeDestroy, () => {
      delete (vm as any)._$c
    })
  }

  return store
}
// [注意下面每项的顺序]get/(fetch + args)和error改变走fetchData否则updateState
const PROPS = [
  /* 0 */ 'once', // 无需响应
  /* 1 */ 'components',
  /* 2 */ 'filter',
  /* 3 */ 'tag',
  /* 4 */ 'args', // diff
  /* 5 */ 'error',
  /* 6 */ 'fetch',
  /* 7 */ 'get',
]
const EVENTS = {
  none: status.none,
  loading: status.loading,
  error: status.error,
  empty: status.empty,
  success: status.success,
}
function diff(store: IStore, context: RenderContext) {
  let maxChangedIndex = 0 // 有变化prop的最大索引
  let props = context.props
  let attrs = context.data.attrs
  let prop
  let target
  let index = PROPS.length
  while (index--) {
    prop = PROPS[index]
    target = props[prop]
    if (attrs && attrs[prop]) {
      target || (target = attrs[prop])
      attrs[prop] = null // 防止(特别是function)toString到dom属性
    }

    if (target !== (store as any)[prop]) {
      if (index === 4 /** args */) {
        if (store.fetch && !isEqual((store as any)[prop], target)) {
          ;(store as any)[prop] = clone(target)
          maxChangedIndex = 6
        }
      } else {
        ;(store as any)[prop] = target
        maxChangedIndex < index && (maxChangedIndex = index)
      }
    }
  }

  if ((target = context.data.on)) {
    props = store.f || (store.f = {})
    for (prop in EVENTS) {
      props[(attrs = (EVENTS as any)[prop]) as any] === target[prop] ||
        (props[attrs as any] = target[prop])
    }
  }

  switch (maxChangedIndex) {
    case 0: // 无改变
      prop = (target = store.i.i as status) === store.c
      return MAP[target] ? prop : prop ? store.once : updateState(store)
    case 6: // fetch + args
      store.g = isFn(store.fetch) ? 2 : isFn(store.get) && 1
      return fetchData(store)
    case 7: // get
      store.g = isFn(store.get) ? 1 : isFn(store.fetch) && 2
      return fetchData(store)
    case 5: // error
      return fetchData(store)
    default:
      return updateState(store)
  }
}
function trigger(hooks: hooks | undefined, context: RenderContext, data: any) {
  if (Array.isArray(hooks)) {
    let fn
    for (fn of hooks) {
      fn(context, data)
    }
  } else if (hooks) {
    hooks(context, data)
  }
}

/** 异步选择器组件(functional, 兼容同步), 最终渲染组件将得到一个prop: data (同步时值为1), 即异步结果
 *  【相同父组件(functional当然不算)存在多个选择器时, 必须提供key作为唯一标识】
 *
 *  props: 见: interface IStore 注释 【注意】: 响应任意prop变化
 *
 *  slots: 见: const enum status 键值, 支持对应作用域插槽(优先)/插槽【二选一】(二者都有时无法确定顺序, 故)
 *
 *  events: 见: const enum status 键值
 *
 *  示例:
 *  <template>
 *    <Async :key="key" :fetch="fetch" :args="args" @error="handleError">
 *      <template #error>出错了</template>
 *      <!-- 同 #default 【二选一】 -->
 *      <template #success="{ data }">
 *        <textarea>{{ JSON.stringify(data) }}</textarea>
 *      </template>
 *    </Async>
 *  </template>
 *
 * ( import 了咋没得文档呢, 因为tsx么... ┐(: ´ ゞ｀)┌ )
 */
export default (context: RenderContext) => {
  let temp // 大工具人
  let data // 小工具人
  const store = getStore(
    (temp = context.parent), // 默认key: String.fromCharCode(1)
    hasOwn((data = context.data), 'key') ? data.key : (data.key = '')
  )

  if (store.i.d || (temp.$el && !temp.$el.parentNode) || diff(store, context)) {
    return store.n // 父/此组件失活/离开,自身未变化&once等
  }

  temp = data.on || (data.on = {})
  temp.$ = store.h.$ // $emit('$')刷新
  setHook(temp, activated, store.h.a)
  setHook(temp, deactivated, store.h.d)

  let Comp: any = store.i.i
  store.f &&
    store.c !== Comp &&
    trigger(
      store.f[Comp as status] || store.f[status.success],
      context,
      store.d
    )
  store.c = Comp

  let slot
  if ((slot = MAP[Comp as status])) {
    slot = context.scopedSlots[slot]
      ? context.scopedSlots[slot](store.d)
      : context.slots()[slot]
    if (slot && slot.length) {
      data = data.key + Comp
      Comp = store.tag
      return (store.n = (
        <Comp key={data} on={temp}>
          {slot}
        </Comp>
      ))
    }
  }

  switch (Comp) {
    case status.none:
      return (store.n = (
        <i key={data.key + Comp} style="display:none" on={temp} />
      ))
    case status.loading:
      return (store.n = <Loading key={data.key + Comp} on={temp} />)
    case status.empty:
      return (store.n = (
        <Info
          key={data.key + Comp}
          icon="el-icon-info"
          type="info"
          msg="empty"
          retry=""
          on={temp}
        />
      ))
    case status.error:
      return (store.n = <Info key={data.key + Comp} on={temp} />)
    default:
      data.props = context.props
      store.d && (data.props.data = store.d.data)

      slot = (slot = context.scopedSlots).success || slot.default
      return (store.n = (
        <Comp {...data}>
          {slot
            ? slot(store.d)
            : (slot = context.slots()).success || slot.default}
        </Comp>
      ))
  }
}
