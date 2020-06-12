/** 鉴权 */
import Vue from 'vue'

import { STORAGE } from '@/enums'
import { hasOwn, isObj } from '@/utils'
import { Rule } from '@/pipe'
import { local } from '@/utils/storage'

import { Login } from '@/api/authServer/user'
import { pwd, encode, decode } from './cipher'

/** 子页面信息 */
export type ChildInfo = { title: string; child?: ChildInfo[] }
export interface Menu {
  /** 子页面信息 example: OrderedMap { "JSON": null } */
  child?: ChildInfo[]
  /** 子页面 */
  children?: Menu[]
  /** 图标名称 */
  icon?: string
  /** 菜单唯一标识 */
  id?: string
  /** 访问路径 */
  path?: string
  /** 模块名称 */
  title?: string
  /** 模块描述 */
  desc?: string
  /** 是否隐藏节点 */
  hide?: 1
}
type AuthDic = { [authKey: string]: 1 }
/** 存储的权限信息 */
export interface Auth extends Menu {
  /** 权限字典 { 权限代码: 权限描述 } */
  AUTH: { [id: string]: AuthDic }
}

/** 权限信息 */
const AUTH = (local.get(STORAGE.auth, decode) || {}) as Auth
AUTH.AUTH || (AUTH.AUTH = {})

const trim = (v: any) => v && { v }
/** 权限信息过滤规则 */
const rule: Rule = {
  childInfo(v: string) {
    try {
      v = JSON.parse(v)
    } catch (error) {
      return
    }
    return v && { k: 'child', v }
  },
  children: (v: any) => v && v.length && { v },
  description: (v: string) => v && { k: 'desc', v },
  elementList(filteredValue: any, obj: any) {
    if (!filteredValue || !filteredValue.length) {
      return
    }

    const auth = AUTH.AUTH
    let element
    let temp
    for (element of filteredValue) {
      temp = auth[obj.menuCode] || (auth[obj.menuCode] = {})
      temp[element.elementCode] = 1
    }
  },
  elementCode: trim,
  icon: trim,
  menuCode: (v: string) => v && { k: 'id', v },
  path: trim,
  rootNode: (v: any) => v && { k: 'hide', v },
  title: trim,
}

/** 重建菜单树 */
function rebuild(menu: any) {
  // 深度优先
  const children = menu.children
  let index = (children && children.length) as number
  let child
  let cLen
  while (index--) {
    child = children[index]
    if ((cLen = child.children?.length)) {
      if (child.rootNode) {
        if (child.menuCode) {
          children.splice(index - 1, 0, ...child.children)
          index += cLen
          delete child.children
        } else {
          children.splice(index, 1, ...child.children)
          index += cLen - 1
        }
        child = children[index]
      }
      rebuild(child)
    }
  }
  return menu
}

/** 根据id获取权限信息 */
function getById(id: string, auth?: Auth | Menu): Menu | undefined {
  auth || (auth = AUTH)
  if (id === auth.id) {
    return auth
  }

  // 深度优先
  const children = auth.children
  if (children && children.length) {
    let child
    let node
    for (child of children) {
      if ((node = getById(id, child))) {
        return node
      }
    }
  }
}

/** 获取兄弟节点(包括自身) */
function siblings(id: string, auth?: Auth | Menu): Menu[] | undefined {
  auth || (auth = AUTH)
  // 深度优先
  const children = auth.children
  if (children && children.length) {
    let child
    for (child of children) {
      if (id === child.id) {
        return (auth !== AUTH && children) as any
      }
      if ((child = siblings(id, child))) {
        return child
      }
    }
  }
}

/** 加密传输 */
function encrypt(form: Login) {
  return {
    username: encode(form.username),
    password: pwd(form.password, form.username),
  }
}

function getId(this: Vue): string | undefined {
  const id = ((this as any).route || this.$route).meta
  return id && id.id
}

type authObject = { [key: string]: any }
/** 权限信息 */
export type authInfo = string | string[] | authObject | authObject[]

function fitAuthObject(auth: AuthDic, info: authObject) {
  let key
  for (key in info) {
    if (!hasOwn(auth, key)) {
      return false
    }
  }
  return true
}
/** 是否满足(全部)指定权限
 * @param auth 权限字典或模块标识
 * @param authInfo 权限信息数组
 */
function authFit(auth: string | AuthDic, args: authInfo[]) {
  if (!args.length || !(auth && (isObj(auth) || (auth = AUTH.AUTH[auth])))) {
    return false
  }

  let info
  let item
  for (info of args) {
    if (Array.isArray(info)) {
      for (item of info) {
        if (isObj(item) ? !fitAuthObject(auth, item) : !hasOwn(auth, item)) {
          return false
        }
      }
    } else if (isObj(info)) {
      if (!fitAuthObject(auth, info)) {
        return false
      }
    } else if (!hasOwn(auth, info)) {
      return false
    }
  }
  return true
}
/** 是否满足(全部)指定权限
 * @param authInfo 权限信息
 */
function fit(this: Vue, ...authKey: authInfo[]): boolean
function fit(this: Vue) {
  return authFit(getId.call(this) as string, arguments as any)
}

function hasAuthObject(auth: AuthDic, info: authObject) {
  let key
  for (key in info) {
    if (hasOwn(auth, key)) {
      return true
    }
  }
  return false
}
/** 是否包含指定权限(之一)
 * @param auth 权限字典或模块标识
 * @param authInfo 权限信息数组
 */
function authHas(auth: string | AuthDic, args: authInfo[]) {
  if (!args.length || !(auth && (isObj(auth) || (auth = AUTH.AUTH[auth])))) {
    return false
  }

  let info
  let item
  for (info of args) {
    if (Array.isArray(info)) {
      for (item of info) {
        if (isObj(item) ? hasAuthObject(auth, item) : hasOwn(auth, item)) {
          return true
        }
      }
    } else if (isObj(info)) {
      if (hasAuthObject(auth, info)) {
        return true
      }
    } else if (hasOwn(auth, info)) {
      return true
    }
  }
  return false
}
/** 是否包含指定权限(之一)
 * @param authInfo 权限信息
 */
function has(this: Vue, ...authKey: authInfo[]): boolean
function has(this: Vue) {
  return authHas(getId.call(this) as string, arguments as any)
}

export {
  AUTH,
  rule,
  rebuild,
  getById,
  siblings,
  encode,
  encrypt,
  pwd,
  fit,
  has,
  authFit,
  authHas,
}
