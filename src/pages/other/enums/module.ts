import { ChildInfo } from '@/functions/auth'
import { SPA } from '@/config'

/** 模块【唯一】【固定】标识 【不能与SPA重复】
 *    62进制: 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
 */
export const enum MODULE {}

type ModuleDictionary = { [key in MODULE]: string } & { [key in SPA]?: string }

/** 模块字典 */
export const MODULES: ModuleDictionary = {}

/** 下级模块字典 */
export const SUB_MODULES: { [key in MODULE]?: ChildInfo[] } = {}
