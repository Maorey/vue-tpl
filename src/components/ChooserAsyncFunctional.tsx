/**
 * @Description: 组件选择器(异步) 比如: Ajax完成后才知道该使用哪个组件
 * @Author: 毛瑞
 * @Date: 2020-01-02 16:13:36
 */
/// 【示例】 ///
/* <template>
  <div>
    <!-- 必须提供组件唯一标识key, key应使用导出的getKey方法获得 -->
    <ChooserAsyncFunctional :key="key" :get="get">
      <template #default="{ data }">
        <textarea :value="JSON.stringify(data)" />
      </template>
    </ChooserAsyncFunctional>
  </div>
</template> */
import Vue, { Component, RenderContext, VNodeData, VNode } from 'vue'

/// [import] vue组件,其他,CSS Module ///
// import { getAsync } from '@/utils/highOrder'
// import STYLE from './index.module.scss'
import Info from './Info'
import Loading from './Loading'

/// 常量(UPPER_CASE),单例/变量(camelCase),函数(无副作用,camelCase) ///
// const ModuleOne: any = getAsync(() =>
//  import(/* webpackChunkName: "ihOne" */ './ModuleOne')
// )
export const enum status {
  none = 1,
  loading,
  error,
  empty,
  success,
}
const enum acceptProps {
  get = 'get',
  error = 'error',
  tag = 'tag',
  filter = 'filter',
  components = 'components',
  propagate = 'propagate',
}
type component = status | string | Component
type filter = (data: any) => { data: any; comp: component } | void
type statusType = status
type state = {
  /** 接受的props
   */
  /** 未匹配到任何组件但有数据时使用的组件[默认‘div’] 若字典存在, tag为字符串, 则优先从字典取
   */
  [acceptProps.tag]?: component
  /** 查询函数
   */
  [acceptProps.get]?: () => Promise<IObject>
  /** 选择组件函数 若字典存在, 返回的comp属性为字符串, 则优先从字典取
   */
  [acceptProps.filter]?: filter
  /** 选择组件函数 若字典存在, 返回的comp属性为字符串, 则优先从字典取
   */
  [acceptProps.error]?: status | ((err: Error) => component)
  /** 组件字典 当filter返回string时即从字典取对应组件
   */
  [acceptProps.components]?: IObject<Component>
  /** 是否传播支持的事件(自身不监听)
   */
  [acceptProps.propagate]?: boolean

  /// 私有状态 ///
  /** 当前组件 (响应式属性) */
  i: { i: component }
  /** 原始响应数据 */
  o?: any
  /** 绑定数据 */
  d?: any
  /** context */
  c?: RenderContext
  /** 绑定事件(重试) */
  $: IObject<() => void>
  /** 销毁事件(垃圾回收) */
  _: () => void
  /** 触发的事件: status 枚举 */
  f: {
    [event in statusType]?: Function | Function[]
  }
}

const DEFAULT_TAG = 'div'
function watch(state: state) {
  const data = state.o
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
        (typeof state.error === 'function' ? state.error(err) : state.error) ||
        status.error
    })
}

// get 和 error改变走 get函数 否则watch
const PROPS = {
  [acceptProps.get]: 1,
  [acceptProps.error]: 1,
  [acceptProps.tag]: 1,
  [acceptProps.filter]: 1,
  [acceptProps.components]: 1,
  [acceptProps.propagate]: 1,
}
const EVENTS: IObject<status> = {
  none: status.none,
  loading: status.loading,
  error: status.error,
  empty: status.empty,
  success: status.success,
}
function init(state: state) {
  const context = state.c
  if (!context) {
    return
  }
  state.c = undefined

  const {
    props,
    data: { attrs = {}, on = {} },
  } = context

  let fun
  let flag = true // 是否全部未变化

  let prop
  let target
  /// props ///
  for (prop in PROPS) {
    if (state[prop as acceptProps] !== (target = props[prop] || attrs[prop])) {
      flag = false
      state[prop as acceptProps] = target
      fun ||
        ((prop === acceptProps.get || prop === acceptProps.error) &&
          (fun = get))
    }

    // 不向下传递
    delete attrs[prop]
    delete props[prop]
  }

  // 去掉无效dom属性(虽然不会暴露数据)
  // for (prop in attrs) {
  //   switch (typeof (target = attrs[prop])) {
  //     case 'object':
  //     case 'symbol':
  //     case 'function':
  //     case 'undefined':
  //       props[prop] || (props[prop] = target)
  //       delete attrs[prop]
  //       break
  //   }
  // }

  /// on ///
  if (!state[acceptProps.propagate]) {
    for (prop in on) {
      if ((target = EVENTS[prop])) {
        state.f[target] = on[prop]
        delete on[prop] // 不向下传递
      }
    }
  }

  flag || (fun || watch)(state)
}

function getState(CACHE: any, key: any) {
  CACHE = CACHE._$c || (CACHE._$c = {})
  let state: state = CACHE[key]
  if (!state) {
    state = CACHE[key] = {
      f: {},
      i: Vue.observable({ i: status.loading }), // Vue 3
      $: {
        $: () => {
          get(state)
        },
      },
      _: () => {
        delete CACHE[key]
      },
    }
  }

  return state
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

let counter = 1
/** 获取唯一key【用于标识一个异步选择器函数组件】
 */
export function getKey() {
  return counter++
}

const hook = '~hook:destroyed'
let emptyNode: VNode
/** 异步选择器组件(functional) 【相同父组件存在多个选择器时, 必须提供key作为唯一标识】
 *    支持默认插槽/默认作用域插槽 二选一(二者都有无法确定顺序)
 */
export default (context: RenderContext) => {
  // Fix: 销毁
  const parent = context.parent
  if (parent.$el && !parent.$el.parentNode) {
    // 必须得有个具体节点
    return emptyNode || (emptyNode = <i style="display:none" />)
  }

  let data: VNodeData | typeof context.scopedSlots.default = context.data
  const state = getState(parent, data.key)
  state.c = context
  init(state)

  const Comp: any = state.i.i // 收集依赖
  switch (Comp) {
    case status.none:
      call(state.f[status.none], context)
      // (不返回也没啥问题)
      return emptyNode || (emptyNode = <i style="display:none" />)
    case status.loading:
      call(state.f[status.loading], context)
      return <Loading />
    case status.empty:
      call(state.f[status.empty], context)
      return <Info icon="el-icon-info" type="info" msg="empty" retry="" />
    case status.error:
      call(state.f[status.error], context)
      return <Info on={state.$} />
    default:
      data.props = context.props
      data.props.data = state.d.data
      ;(data.on || (data.on = {}))[hook] = state._

      call(state.f[status.success], context)
      return (
        <Comp {...data}>
          {context.slots().default ||
            ((data = context.scopedSlots.default) && data(state.d))}
        </Comp>
      )
  }
}
