/** 模块定义 */
import { Component } from 'vue'
import { RedirectOption, NavigationGuard } from 'vue-router'
import { PathToRegexpOptions } from 'vue-router/types/router'

import { Auth } from '@/enums'
import { authInfo } from '../auth'
import DistributeRoute from '@com/RouterViewTransparent'

export { Auth, authInfo }
type LazyRoute = Component
export type DistributeRoute = symbol

interface Common {
  /** 注意: 【不可以使用 route 】作为props */
  props?: { AUTH?: Auth; [key: string]: any }
  redirect?: RedirectOption
  beforeEnter?: NavigationGuard
  caseSensitive?: boolean
  pathToRegexpOptions?: PathToRegexpOptions
}
interface SubmoduleCommon extends Common {
  path: string
  meta?: {
    /** 缓存存活时间 */
    alive?: number
    /** 需要(全部)满足的权限 */
    fit?: authInfo
    /** 需要包含(其一)的权限 */
    has?: authInfo
    [key: string]: any
  }
}
interface SubmoduleSimple extends SubmoduleCommon {
  component: LazyRoute
}
interface SubmoduleComplex extends SubmoduleCommon {
  component: DistributeRoute
  children: Submodule
}
type Submodule = SubmoduleSimple | SubmoduleComplex
interface ModuleCommon extends Common {
  path?: string
  meta: {
    id: string
    /** 缓存存活时间 */
    alive?: number
    [key: string]: any
  }
}
interface ModuleSimple extends ModuleCommon {
  component: LazyRoute
}
interface ModuleComplex extends ModuleCommon {
  component: DistributeRoute
  children: Submodule[]
}

export type Module = ModuleSimple | ModuleComplex
export type ModuleFactory = (options: {
  id: string
  alive?: number
  [key: string]: any
}) => Module
/** 分发路由, 用于组合复杂模块 */
export default DistributeRoute as DistributeRoute
