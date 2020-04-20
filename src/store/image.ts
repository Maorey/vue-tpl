/** see: https://championswimmer.in/vuex-module-decorators
 * @Description: 图片下载内存管理
 * @Author: 默认
 * @Date: 2020-04-20 11:02:15
 */
import { VuexModule, Mutation } from 'vuex-module-decorators'

import { isEqual } from '@/utils'
import getId from '@/utils/getKey'
import { setDefault } from '@/utils/clone'
import {
  download,
  free,
  IPromiseCancelable,
  IFile as IFileInfo,
} from '@/utils/downloader'

/** 任务状态 */
export const enum STATE {
  /** 已因栈/内存溢出丢弃 */
  drop = 0,
  /** 等待下载 */
  wait = 1,
  /** 下载中 */
  loading = 2,
  /** 下载失败 */
  failed = 3,
  /** 下载成功 */
  success = 4,
}
/** 任务参数 */
export interface IParams {
  /** 下载地址 */
  url: string
  /** 查询参数 */
  query?: IObject
}
/** 任务 */
export interface ITask extends IParams {
  /** 任务id */
  id: string
  /** 当前状态 */
  state: STATE
  /** 图片地址 */
  src?: string
  /** setTimeout计时器 */
  t?: number
}
/** 图片下载管理相关 */
export interface ILocal {
  /** 【正整数】同时下载数量(默认6) */
  max: number
  /** 【正整数】最大内存占用(bytes, 默认 256 * 1024 * 1024 = = 2^28 = 256M) */
  RAM: number
  /** 【正整数】自动移除已下载任务时间间隔(ms 默认 2^18 = 262,144) */
  alive?: number
}
/** 图片下载内存管理 */
export interface IImage {
  /** 下载配置 */
  config: ILocal
  /** 任务列表 */
  tasks: ITask[]
  /** 内存使用(已下载的文件) */
  RAM: number
  /** 内存使用百分比(已下载的文件) */
  usage: number
}

/** 默认配置 */
const DEFAULT_CONFIG: ILocal = {
  max: 6,
  RAM: 2 << 27,
  alive: 2 << 17,
}
/** drop的任务自动移除间隔 */
const DROP_TIME = 2 << 15
/** 图片下载缓存 */
const CACHE: IObject<{
  /** 下载Promise */
  p: IPromiseCancelable<IFileInfo>
  /** 下载文件信息 */
  f?: IFileInfo
  /** setTimeout计时器 */
  t?: number
}> = {}
function removeCache(task: ITask) {
  const cache = CACHE[task.id]
  if (cache) {
    clearTimeout(cache.t)
    cache.p.cancel()
    delete CACHE[task.id]
    if (cache.f) {
      free(cache.f)
      return cache.f.size
    }
  }

  return 0
}

/// for 互相调用 ///
function next(this: Image, updateUsageOnly?: boolean) {
  const RAM = this.config.RAM

  if (!updateUsageOnly) {
    const tasks = this.tasks

    const shouldRemove = this.RAM > RAM
    const tasksRemoveable: ITask[] = []

    let temp
    let state
    for (temp of tasks) {
      state = temp.state
      if (!updateUsageOnly && state === STATE.wait) {
        setState.call(this, temp, STATE.loading)
        updateUsageOnly = true
        if (!shouldRemove) {
          return true
        }
      }

      shouldRemove && state === STATE.success && tasksRemoveable.push(temp)
    }

    if ((temp = tasksRemoveable.length)) {
      while (temp-- && this.RAM > RAM) {
        removeTask.call(this, tasksRemoveable[temp])
      }
      return true
    }
  }

  this.usage = (100 * this.RAM) / RAM
}
function setState(this: Image, task: ITask, state: STATE.wait | STATE.loading) {
  if (task.t) {
    clearTimeout(task.t)
    task.t = 0
  }
  if (state === task.state) {
    return
  }

  const alive = this.config.alive
  // 工具人
  let temp
  // 设置状态
  switch (state) {
    case STATE.wait:
      task.state = state
      this.RAM -= removeCache(task)
      next.call(this, true)
      break

    case STATE.loading:
      if ((temp = CACHE[task.id]) && temp.f) {
        clearTimeout(temp.t)
        alive &&
          (temp.t = setTimeout(() => {
            removeTask.call(this, task)
          }, alive))
        task.src = temp.f.src
        task.state = STATE.success
      } else if (this.loading < this.config.max && this.usage < 1) {
        ;(temp = download(task.url, task.query))
          .then(fileInfo => {
            temp = CACHE[task.id]
            temp.f = fileInfo
            alive &&
              (temp.t = setTimeout(() => {
                removeTask.call(this, task)
              }, alive))
            task.src = fileInfo.src
            task.state = STATE.success
            this.RAM += fileInfo.size
          })
          .catch(() => {
            task.state = STATE.failed
          })
          .finally(() => {
            this.loading--
            next.call(this)
          })
        CACHE[task.id] = { p: temp }
        task.state = state
        this.loading++
      } else {
        task.state = STATE.wait
        this.RAM -= removeCache(task)
        next.call(this, true)
      }
      break
  }
}
function removeTask(this: Image, task: ITask) {
  this.RAM -= removeCache(task)
  const state = task.state
  task.state = STATE.drop
  task.src = undefined
  task.t && clearTimeout(task.t)
  task.t = setTimeout(() => {
    const id = task.id
    const tasks = this.tasks
    for (let i = 0, len = tasks.length; i < len; i++) {
      if (id === tasks[i].id) {
        tasks.splice(i, 1)
        return
      }
    }
  }, DROP_TIME)
  next.call(this, state !== STATE.loading)
}

/** 图片下载内存管理 */
export default class Image extends VuexModule implements IImage {
  /// State & Getter(public) ///
  config: ILocal
  tasks: ITask[] = []
  RAM = 0
  usage = 0
  loading!: number

  constructor(module: Image) {
    super(module)
    this.config = setDefault(
      ((this as any).config || {}) as ILocal,
      DEFAULT_CONFIG
    )
  }

  /// Mutation ///
  /** 更新设置
   * @param config 设置
   */
  @Mutation
  CONFIG(config: ILocal) {
    config = Object.assign(this.config, config)

    const max = config.max
    const RAM = config.RAM

    let loading = max - (this.loading || 0)
    const shouldRemove = this.RAM > RAM
    if (loading || shouldRemove) {
      const shouldPause = loading < 0

      const tasks = this.tasks
      const tasksRemoveable: ITask[] = []

      let task
      let state
      let count = 0
      for (task of tasks) {
        state = task.state
        if (shouldPause) {
          state === STATE.loading &&
            (count < max ? count++ : setState.call(this, task, STATE.wait))
        } else if (loading && state === STATE.wait) {
          setState.call(this, task, STATE.loading)
          if (!--loading && !shouldRemove) {
            return
          }
        }

        shouldRemove && state === STATE.success && tasksRemoveable.push(task)
      }

      // 不用pop
      count = 0
      state = tasksRemoveable.length
      while (count++ < state && this.RAM > RAM) {
        removeTask.call(this, tasksRemoveable[state - count])
      }
    }
  }

  /** 加载图片
   * @param payload 任务信息
   *
   * @returns 任务(直接修改原对象)
   */
  @Mutation
  LOAD(payload: { task: IParams; callback: (task: ITask) => void }) {
    this.loading || (this.loading = 0)
    const tasks = this.tasks
    const task = payload.task as ITask
    let item
    for (item of tasks) {
      if (task.url === item.url && isEqual(task.query, item.query)) {
        setState.call(this, item, STATE.loading)
        payload.callback(item)
        return
      }
    }

    item = { state: STATE.wait } as ITask // for watch
    tasks.push(item)
    item.id = getId('i')
    item.url = task.url
    item.query = task.query

    setState.call(this, item, STATE.loading)
    payload.callback(item)
  }

  /// Action ///
}
