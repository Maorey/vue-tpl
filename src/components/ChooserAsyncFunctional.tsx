/**
 * @Description: 组件选择器(异步) 比如: Ajax完成后才知道该使用哪个组件 暂不提供工厂函数
 * @Author: 毛瑞
 * @Date: 2020-01-02 16:13:36
 */
import Vue, { Component, RenderContext, VNode } from 'vue'

/// [import] vue组件,其他,CSS Module ///
// import { getAsync } from '@/utils/highOrder'
// import STYLE from './index.module.scss'
import Info from './Info'
import Loading from './Loading'

import { hasOwnProperty, isFn } from '@/utils'

/// 常量(UPPER_CASE),单例/变量(camelCase),函数(无副作用,camelCase) ///
// const ModuleOne: any = getAsync(() =>
//  import(/* webpackChunkName: "ihOne" */ './ModuleOne')
// )
/** 加载状态, 同时键名也是支持的事件
 */
export const enum status {
  none = 1,
  loading = 2,
  error = 3,
  empty = 4,
  success = 5,
}
export type component = status | string | Component
export type filter = (data: any) => { data: any; comp: component } | void
type state = {
  /// props ///
  /** 未匹配到任何组件但有数据时使用的组件[默认‘div’] 若字典存在, tag为字符串, 则优先从字典取
   */
  tag?: component
  /** 查询函数
   */
  get?: () => Promise<any>
  /** 选择组件函数 若字典存在, 返回的comp属性为字符串, 则优先从字典取
   */
  filter?: filter
  /** 自定义处理查询错误时的展示(接受参数为错误对象)
   */
  error?: status | ((err: Error) => component)
  /** 组件字典 当filter返回string时即从字典取对应组件
   */
  components?: IObject<Component>
  /** 类似 v-once, 默认 false
   */
  once?: boolean

  /// 私有状态 ///
  /** Vue响应式数据 */
  i: {
    /** 当前组件 */
    i: component
    /** 父组件是否未激活 */
    d: 0 | 1
  }
  /** 触发的事件: status 枚举 */
  f: { [event in status]?: Function | Function[] }
  /** hooks */
  h: {
    /** 重新加载 */
    $: () => void
    /** 父/返回组件 activated */
    a: () => void
    /** 父/返回组件 deactivated */
    d: () => void
    // /** 父组件 destroyed */
    // e: () => void
  }
  /** 原始响应 */
  o?: any
  /** 绑定 props.data */
  d?: any
  /** 当前组件VNode */
  n?: VNode
  /** 上一次组件(once时比较) */
  c?: component
}

function watch(state: state) {
  const data = state.o
  const DEFAULT_TAG = 'div'
  if (data) {
    const DIC = state.components
    const tag = state.tag
    if (!state.filter) {
      state.d = { data }
      state.i.i = (DIC && DIC[tag as string]) || tag || DEFAULT_TAG
      return
    }

    const result = state.filter(data)
    if (result) {
      state.d = { data: result.data || result }
      state.i.i =
        (DIC && DIC[result.comp as string]) || result.comp || tag || DEFAULT_TAG
      return
    }
  }

  state.i.i = status.empty
}
function get(state: state) {
  state.i.i = status.loading
  // eslint-disable-next-line prefer-promise-reject-errors
  ;(state.get ? state.get() : Promise.reject())
    .then(data => {
      state.o = data
      watch(state)
    })
    .catch(err => {
      state.i.i =
        (isFn(state.error) ? (state.error as any)(err) : state.error) ||
        status.error
    })
}

// get和error改变走get否则watch
const DIC_PROPS = {
  get: 1,
  error: 1,
  filter: 1,
  once: 1,
  tag: 1,
  components: 1,
}
const DIC_EVENTS: IObject<status> = {
  none: status.none,
  loading: status.loading,
  error: status.error,
  empty: status.empty,
  success: status.success,
}
function init(state: state, context: RenderContext) {
  const {
    props,
    data: { attrs = {}, on = {} },
  } = context

  let fun
  let isSame = true // 是否全部未变化

  let prop
  let target
  /// props/attrs ///
  for (prop in DIC_PROPS) {
    if ((target = props[prop] || attrs[prop]) !== (state as any)[prop]) {
      isSame = false
      fun || ((prop === 'get' || prop === 'error') && (fun = get))
    }
    ;(state as any)[prop] = target
    attrs[prop] && (attrs[prop] = null) // 防止(特别是function)toString到dom属性
  }

  /// on ///
  for (prop in DIC_EVENTS) {
    state.f[DIC_EVENTS[prop]] = on[prop]
  }

  if (isSame) {
    if (state.get || state.error) {
      return state.once
    }
    state.o = 1 // for use slot
  }

  return (fun || watch)(state)
}

const activated = 'hook:activated'
const deactivated = 'hook:deactivated'
function getState(vm: Vue, key: any) {
  const CACHE = (vm as any)._$c || ((vm as any)._$c = {})
  let state: state = CACHE[key]
  if (!state) {
    state = CACHE[key] = {
      f: {},
      i: Vue.observable({ i: status.loading, d: 0 } as state['i']),
      h: {
        $: () => {
          get(state)
        },
        a: () => {
          state.i.d = 0
        },
        d: () => {
          state.i.d = 1
        },
      },
    }

    // LifeCycle hooks for parent
    vm.$on(activated, state.h.a)
    vm.$on(deactivated, state.h.d)
    vm.$on('hook:destroyed', () => {
      delete CACHE[key]
    })
  }

  return state
}
function hook(on: IObject<Function | Function[]>, hook: string, fn: Function) {
  if (!on[hook]) {
    on[hook] = fn
  } else if (Array.isArray(on[hook])) {
    ;(hook = on[hook] as any).includes(fn) || (hook as any).push(fn)
  } else if (on[hook] !== fn) {
    on[hook] = [on[hook] as Function, fn]
  }
}

function call(hooks: state['f'][status], context: RenderContext) {
  if (!hooks) {
    return
  }

  if (Array.isArray(hooks)) {
    for (const fn of hooks) {
      fn(context)
    }
  } else {
    hooks(context)
  }
}

/** 异步选择器组件(functional), 最终渲染组件将得到一个prop: data, 即异步结果
 *  【相同父组件(functional当然不算)存在多个选择器时, 必须提供key作为唯一标识】
 *
 *  props: 见: type state 注释 【注意】: get/error 变化时会重新请求
 *
 *  events: 见: const enum status 键值
 *
 *  slots: 支持默认插槽/默认作用域插槽【二选一】(二者都有时无法确定顺序, 故)
 *
 *  示例:
 *  <template>
 *    <ChooserAsyncFunctional :key="key" :get="get" @error="handleError">
 *      <template #default="{ data }">
 *        <textarea :value="JSON.stringify(data)" />
 *      </template>
 *    </ChooserAsyncFunctional>
 *  </template>
 *
 * ( import 了咋没得文档呢, 因为tsx么... ┐(: ´ ゞ｀)┌ )
 */
export default (context: RenderContext) => {
  // identify/mark this functional component by/to parent._$c use key
  let temp // 工具人
  temp = context.parent
  const data = context.data
  const state = getState(
    temp,
    hasOwnProperty(data, 'key') ? data.key : (data.key = '')
  )

  // situations to use VNode cache
  if (state.i.d || (temp.$el && !temp.$el.parentNode)) {
    return state.n // 父组件失活/休眠等
  }

  // init state with diff
  temp = init(state, context)
  const Comp: any = state.i.i // 收集依赖
  if (temp && Comp === state.c) {
    return state.n // once & 自身未变化
  }

  // LifeCycle hooks for Comp & emit events
  state.c = Comp
  temp = data.on || (data.on = {})
  hook(temp, activated, state.h.a)
  hook(temp, deactivated, state.h.d)
  call(state.f[Comp as status] || state.f[status.success], context)

  // save & return VNode
  switch (Comp) {
    case status.none:
      return (state.n = (
        <i key={data.key + 'w'} style="display:none" on={temp} />
      ))
    case status.loading:
      return (state.n = <Loading key={data.key + 'x'} on={temp} />)
    case status.empty:
      return (state.n = (
        <Info
          key={data.key + 'y'}
          icon="el-icon-info"
          type="info"
          msg="empty"
          retry=""
          on={temp}
        />
      ))
    case status.error:
      temp.$ = state.h.$ // reload
      return (state.n = <Info key={data.key + 'z'} on={temp} />)
    default:
      // add props
      data.props = context.props
      data.props.data = state.d.data

      temp = context.scopedSlots.default // scopedSlots first
      return (state.n = (
        <Comp {...data}>{temp ? temp(state.d) : context.slots().default}</Comp>
      ))
  }
}
