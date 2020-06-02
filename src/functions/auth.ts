/** 鉴权 */
import Vue from 'vue'
import { hasOwn, isObj, isFn } from '@/utils'
import { STORAGE } from '@/enums'

import { local } from '@/utils/storage'
import { Login } from '@/api/auth/user'
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
/** 权限信息过滤规则 */
const rule = {
  childInfo(v: string) {
    try {
      v = JSON.parse(v)
    } catch (error) {
      return
    }
    return { k: 'child', v }
  },
  children: 1 as const,
  elementList(filteredValue: any, obj: any) {
    if (!filteredValue.length) {
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
  elementCode: 1 as const,
  icon: 1 as const,
  menuCode: (v: string) => ({ k: 'id', v }),
  path: 1 as const,
  title: 1 as const,
}

/** 加密传输 */
function encrypt(form: Login) {
  return {
    username: encode(form.username),
    password: pwd(form.password, form.username),
  }
}
/** 去掉falsy属性/空对象/空数组拷贝 */
function trim<T extends object>(obj: T, deep?: boolean): T
function trim<T extends object>(
  obj: T,
  whileList?: {
    [attr: string]:
      | 1
      | ((filteredValue: any, obj: T) => { k: string; v: any } | void)
  },
  deep?: boolean
): T
function trim(obj: any, whileList?: any, deep?: any) {
  if (!obj) {
    return obj
  }
  isObj(whileList) || (deep = whileList)

  const result: any = Array.isArray(obj) ? [] : {}
  let attr
  let value
  let temp
  for (attr in obj) {
    if (
      !(value = obj[attr]) ||
      (!result.pop && deep !== whileList && !(temp = whileList[attr]))
    ) {
      continue
    }

    if (deep && isObj(value)) {
      value = trim(value, whileList, deep)
      if (isFn(temp)) {
        temp = temp(value, obj)
        if (temp && (value = temp.v)) {
          attr = temp.k
        } else {
          // temp = 0
          break
        }
      }
      for (temp in value) {
        result[attr] = value
        // temp = 0
        break
      }
    } else {
      result[attr] = value
    }
  }
  return result
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

export { AUTH, rule, encode, encrypt, pwd, trim, fit, has, authFit, authHas }
