/** see: https://championswimmer.in/vuex-module-decorators
 * @Description: 文件下载管理
 * @Author: 毛瑞
 * @Date: 2020-02-11 14:43:12
 */
import { VuexModule, Mutation } from 'vuex-module-decorators'

import getId from '@/utils/getKey'
import { isEqual, isNumber } from '@/utils'
import { setDefault } from '@/utils/clone'
import sort, { Compare, ASC, DES } from '@/utils/sort'
import {
  download,
  save,
  free,
  IPromiseCancelable,
  IFile as IFileInfo,
} from '@/utils/downloader'

import { hook } from './prefer'

/** 任务状态 */
export const enum STATE {
  /** 已移除(逻辑移除, 并释放内存) */
  del = 0,
  /** 等待下载 */
  wait = 1,
  /** 下载中 */
  loading = 2,
  /** 已暂停 */
  pause = 3,
  /** 下载失败 */
  failed = 4,
  /** 下载成功 */
  success = 5,
  /** 已保存 */
  saved = 6,
}
/** 任务参数 */
export interface IParams {
  /** 下载地址 */
  url: string
  /** 查询参数 */
  query?: IObject
  /** 文件名 */
  name?: string
  /** 文件类型 */
  type?: string
  /** 不缓存 比如导出文件 */
  noCache?: boolean
}
/** 任务 */
export interface ITask extends IParams {
  /** 任务id */
  id: string
  /** 当前状态 */
  state: STATE
  /** 请求(缓存)标识 */
  key: string
}
/** 文件下载管理相关 */
export interface ILocal {
  /** 下载配置 */
  conf: {
    /** 【正整数】同时下载数量(默认3) */
    max: number
    /** 【正整数】下载队列大小(默认10) */
    size: number
    /** 【正整数】最大内存占用(bytes, 默认 128 * 1024 * 1024 = = 2^27 = 128M) */
    RAM: number
    /** 【正整数】自动移除已保存任务时间间隔(ms 默认 2^19 = 524,288) */
    alive?: number
    /** 自动下载上次未完成任务(默认false) */
    auto?: boolean
  }
  /** 待恢复任务 */
  tasks: IParams[]
}
/** 文件下载管理 */
export interface IFile {
  /** 下载配置 */
  config: ILocal['conf']
  /** 任务列表 */
  tasks: ITask[]
  /** 等待下载数量 */
  wait: number
  /** 下载中数量 */
  loading: number
  /** 已暂停数量 */
  pause: number
  /** 下载失败数量 */
  failed: number
  /** 下载成功数量 */
  success: number
  /** 下载进度(-1表示无任务)[0, 100] 下载成功/(下载成功 + 下载中 + 等待下载) */
  progress: number
  /** 内存使用(已下载的文件) */
  RAM: number
  /** 内存使用百分比(已下载的文件) */
  usage: number
}
type statAttr = 'wait' | 'loading' | 'pause' | 'failed' | 'success'

/** 状态统计映射 */
const MAP_KEY = {
  [STATE.wait]: 'wait',
  [STATE.loading]: 'loading',
  [STATE.pause]: 'pause',
  [STATE.failed]: 'failed',
  [STATE.success]: 'success',
} as { [key in STATE]: statAttr }
/** 默认配置 */
const DEFAULT_CONFIG: ILocal = {
  conf: { max: 3, size: 10, RAM: 2 << 26, alive: 2 << 18 },
  tasks: [],
}
/** 文件下载缓存 */
const CACHE: IObject<{
  /** 下载Promise */
  p: IPromiseCancelable<IFileInfo>
  /** 下载文件信息 */
  f?: IFileInfo
  /** setTimeout计时器 */
  t?: number
}> = {}
function getTaskIndex(tasks: ITask[], task: ITask | number | string) {
  if (isNumber(task)) {
    if (!tasks[task]) {
      return -1
    }
  } else {
    task = (task as ITask).id || (task as string)
    task = tasks.findIndex(item => task === item.id)
  }

  return task
}
/** task:
 *
 *    sting: 只要存在key为该值的就不移除
 *
 *    ITask: 只要存在其他key为当前key的就不删除
 */
function removeCache(tasks: ITask[], task: ITask | string) {
  const key = (task as ITask).key || (task as string)
  const cache = CACHE[key]
  if (cache) {
    const id = (task as ITask).id
    for (task of tasks) {
      if (key === task.key && id !== task.id) {
        return 0
      }
    }

    clearTimeout(cache.t)
    cache.p.cancel()
    delete CACHE[key]
    if (cache.f) {
      free(cache.f)
      return cache.f.size
    }
  }

  return 0
}
function insertRemoveableTask(removeableTasks: ITask[], task: ITask) {
  if (task.noCache) {
    for (let i = 0, len = removeableTasks.length; i < len; i++) {
      if (!removeableTasks[i].noCache) {
        removeableTasks.splice(i, 0, task)
        return
      }
    }
  } else {
    removeableTasks.push(task)
  }
}

/// for 互相调用 ///
function next(this: IFile, updateProgressOnly?: boolean) {
  let temp
  const RAM = this.config.RAM

  if (!updateProgressOnly) {
    const tasks = this.tasks

    const shouldRemove = this.RAM > RAM
    const tasksRemoveable: ITask[] = []

    let state
    for (temp of tasks) {
      state = temp.state
      if (!updateProgressOnly && state === STATE.wait) {
        SET_STATE.call(this, { task: temp, state: STATE.loading })
        updateProgressOnly = true
        if (!shouldRemove) {
          return
        }
      }

      shouldRemove &&
        state === STATE.saved &&
        insertRemoveableTask(tasksRemoveable, temp)
    }

    if ((temp = tasksRemoveable.length)) {
      for (state = 0; state < temp && this.RAM > RAM; state++) {
        REMOVE_TASK.call(this, { task: tasksRemoveable[state] })
      }
      return
    }
  }

  this.usage = (100 * this.RAM) / RAM
  temp = this.success + this.loading + this.wait
  this.progress = temp ? (100 * this.success) / temp : -1
}
function ADD_TASK(
  this: IFile,
  payload: IParams | { task: IParams; state?: STATE.pause | STATE.loading }
): ITask {
  let task
  let state
  if ((payload as any).task) {
    task = (payload as any).task
    state = (payload as any).state
  } else {
    task = payload
  }

  const tasks = this.tasks
  let item
  let key
  if (!task.noCache) {
    for (item of tasks) {
      if (task.url === item.url && isEqual(task.query, item.query)) {
        if (task.name === item.name && task.type === item.type) {
          return item
        }

        key = item.key
        break
      }
    }
  }

  item = { state: STATE.del } as ITask // for watch
  tasks.push(item)
  item.id = getId('f')
  item.key = key || item.id
  setDefault(item, task)
  SET_STATE.call(this, { task: item, state: state || STATE.loading })
  return item
}
function SET_STATE(
  this: IFile,
  {
    task,
    state,
  }: {
    task: ITask | number | string
    state: STATE.wait | STATE.pause | STATE.loading
  }
) {
  const tasks = this.tasks
  if (!(task = tasks[getTaskIndex(tasks, task)]) || state === task.state) {
    return
  }

  // 工具人
  let temp
  temp = MAP_KEY[task.state]
  temp && this[temp as statAttr] && this[temp as statAttr]--
  // 设置状态
  switch (state) {
    case STATE.wait:
    case STATE.pause:
      this.RAM -= removeCache(tasks, task)
      temp = task.state
      task.state = state

      if (state === STATE.wait) {
        this.wait++
        break
      }

      this.pause++
      return next.call(this, temp !== STATE.loading)

    case STATE.loading:
      if ((temp = CACHE[task.key]) && temp.f) {
        if (task.state < STATE.saved) {
          task.state = STATE.success
          this.success++
        } else {
          clearTimeout(temp.t)
          this.config.alive &&
            (temp.t = setTimeout(() => {
              REMOVE_TASK.call(this, { task })
            }, this.config.alive))
        }
      } else if (this.loading < this.config.max && this.usage < 1) {
        ;(temp = download(task.url, task.query, task.name))
          .then(fileInfo => {
            CACHE[(task as ITask).key].f = fileInfo
            ;(task as ITask).state = STATE.success
            this.RAM += fileInfo.size
            this.success++
          })
          .catch(() => {
            ;(task as ITask).state = STATE.failed
            this.failed++
          })
          .finally(() => {
            this.loading--
            next.call(this)
          })
        CACHE[task.key] = { p: temp }
        task.state = state
        this.loading++
      } else {
        this.RAM -= removeCache(tasks, task)
        task.state = STATE.wait
        this.wait++
      }
      break
  }
  next.call(this, true)
}
function REMOVE_TASK(
  this: IFile,
  {
    task,
    force,
    state,
  }: {
    task: ITask | number | string
    force?: boolean
    state?: STATE
  }
) {
  const tasks = this.tasks
  let temp: any = getTaskIndex(tasks, task) // 工具人
  if (!(task = tasks[temp]) || (isNumber(state) && state !== task.state)) {
    return
  }

  if ((state = task.state) === STATE.del) {
    force && tasks.splice(temp, 1)
    return
  }

  this.RAM -= removeCache(tasks, task)
  task.state = STATE.del
  force && tasks.splice(temp, 1)

  state &&
    (temp = MAP_KEY[state]) &&
    this[temp as statAttr] &&
    this[temp as statAttr]--
  next.call(this, state !== STATE.loading)
}

/** 文件下载管理 */
export default class File extends VuexModule implements IFile {
  /// State & Getter(public) ///
  config: ILocal['conf']
  tasks: ITask[]
  wait = 0
  loading = 0
  pause = 0
  failed = 0
  success = 0
  progress = -1
  RAM = 0
  usage = 0

  constructor(module: File, local?: ILocal) {
    super(module)

    local &&
      hook(() => {
        const tasks = this.tasks
        for (let i = 0, len = tasks.length, task; i < len; i++) {
          task = tasks[i]
          if (!task.state || task.state === STATE.saved) {
            tasks.splice(i--, 1)
            len--
          } else {
            delete task.id
            delete task.key
            delete task.state
          }
        }

        ;(local as ILocal).tasks = tasks
        ;(local as ILocal).conf = this.config
      })

    local = setDefault(local || {}, DEFAULT_CONFIG)
    this.config = local.conf
    const tasks = (this.tasks = local.tasks as ITask[])
    if (tasks.length) {
      const state = this.config.auto ? STATE.loading : STATE.pause
      let task
      for (task of tasks) {
        task.id = task.key = getId('f')
        this.SET_STATE({ task, state })
      }
    }
  }

  /// Mutation ///
  /** 更新设置
   * @param config 设置
   */
  @Mutation
  CONFIG(config: IFile['config']) {
    config = Object.assign(this.config, config)
    const tasks = this.tasks

    const max = config.max
    const RAM = config.RAM

    const remove = tasks.length - config.size
    const shouldRemove = remove > 0 || this.RAM > RAM

    let loading = max - this.loading
    if (loading || shouldRemove) {
      const shouldPause = loading < 0
      const tasksRemoveable: ITask[] = []

      let task
      let state
      let count = 0
      for (task of tasks) {
        state = task.state
        if (shouldPause) {
          state === STATE.loading &&
            (count < max
              ? count++
              : SET_STATE.call(this, { task, state: STATE.wait }))
        } else if (loading && state === STATE.wait) {
          SET_STATE.call(this, { task, state: STATE.loading })
          if (!--loading && !shouldRemove) {
            return
          }
        }

        shouldRemove &&
          state === STATE.saved &&
          insertRemoveableTask(tasksRemoveable, task)
      }

      for (
        count = 0, state = tasksRemoveable.length;
        count < state && (count < remove || this.RAM > RAM);
        count++
      ) {
        REMOVE_TASK.call(this, { task: tasksRemoveable[count] })
      }
    }
  }

  /** 添加任务
   * @param payload 任务信息
   *
   * @returns 任务(直接修改原对象)
   */
  @Mutation
  ADD_TASK(payload: {
    task: IParams | { task: IParams; state?: STATE.pause | STATE.loading }
    callback: (task: ITask) => void
  }) {
    payload.callback(ADD_TASK.call(this, payload.task))
  }

  /** 批量添加任务
   * @param payload 任务信息
   *
   * @returns 对应任务数组(直接修改原数组里的对象)
   */
  @Mutation
  ADD_TASKS(payload: {
    tasks:
      | (IParams | { task: IParams; state?: STATE.pause | STATE.loading })[]
      | {
          tasks: (
            | IParams
            | { task: IParams; state?: STATE.pause | STATE.loading }
          )[]
          state?: STATE.pause | STATE.loading
        }
    callback: (tasks: ITask[]) => any
  }) {
    let tasks
    let state: any
    if (Array.isArray(payload.tasks)) {
      tasks = payload.tasks
    } else {
      tasks = payload.tasks.tasks
      state = payload.tasks.state
    }

    payload.callback(
      tasks.map(task =>
        ADD_TASK.call(
          this,
          (task as any).task ? (task as any) : { task, state }
        )
      )
    )
  }

  /** 修改任务状态, 只支持暂停/下载
   * @param payload 任务信息
   *
   * @returns 任务
   */
  @Mutation
  SET_STATE(payload: {
    task: ITask | number | string
    state: STATE.wait | STATE.pause | STATE.loading
  }) {
    SET_STATE.call(this, payload)
  }

  /** 批量修改任务状态, 只支持暂停/下载
   * @param payload 任务信息
   *
   * @returns 对应任务数组
   */
  @Mutation
  SET_STATES(
    payload:
      | (
          | {
              task: ITask | number | string
              state: STATE.pause | STATE.loading
            }
          | ITask
          | number
          | string
        )[]
      | {
          tasks: (
            | {
                task: ITask | number | string
                state: STATE.pause | STATE.loading
              }
            | ITask
            | number
            | string
          )[]
          state?: STATE.pause | STATE.loading
        }
      | STATE.pause
      | STATE.loading
  ) {
    let state: any
    let tasks
    if (Array.isArray(payload)) {
      tasks = payload
    } else if (isNumber(payload)) {
      state = payload
      tasks = this.tasks
    } else {
      tasks = payload.tasks
      state = payload.state
    }

    let task
    for (task of tasks) {
      SET_STATE.call(this, (task as any).task ? (task as any) : { task, state })
    }
  }

  /** 移/删除任务
   * @param payload 任务信息
   *
   * @returns 任务
   */
  @Mutation
  REMOVE_TASK(payload: {
    task: ITask | number | string
    force?: boolean
    state?: STATE
  }) {
    REMOVE_TASK.call(this, payload)
  }

  /** 批量移/删除任务
   * @param payload 任务信息
   *
   * @returns 对应任务数组
   */
  REMOVE_TASKS(
    payload?:
      | (
          | ITask
          | number
          | string
          | {
              task: ITask | number | string
              force?: boolean
            }
        )[]
      | {
          tasks: (
            | ITask
            | number
            | string
            | {
                task: ITask | number | string
                force?: boolean
              }
          )[]
          force?: boolean
          state?: STATE
        }
      | STATE
  ) {
    let tasks
    let force: any
    let state: any
    if (Array.isArray(payload)) {
      tasks = payload
    } else if (!payload || isNumber(payload)) {
      state = payload
      tasks = this.tasks
    } else {
      tasks = payload.tasks
      force = payload.force
      state = payload.state
    }

    let task
    for (task of tasks) {
      REMOVE_TASK.call(
        this,
        (task as any).task ? (task as any) : { task, force, state }
      )
    }
  }

  /** 保存文件
   * @param {ITask|number|string} task 任务/索引/id
   */
  @Mutation
  SAVE(task: ITask | number | string) {
    const tasks = this.tasks
    if (!(task = tasks[getTaskIndex(tasks, task)])) {
      return
    }

    const cache = CACHE[task.key]
    if (cache) {
      let alive
      switch (task.state) {
        case STATE.success:
          task.state = STATE.saved
          this.success--
        // eslint-disable-next-line no-fallthrough
        case STATE.saved:
          save(cache.f as IFileInfo)
          if (task.noCache) {
            REMOVE_TASK.call(this, { task })
          } else {
            clearTimeout(cache.t)
            ;(alive = this.config.alive) &&
              (cache.t = setTimeout(() => {
                REMOVE_TASK.call(this, { task })
              }, alive))
          }
          next.call(this, this.usage <= 1)
          break
      }
    }
  }

  /** 排序下载任务
   * @param {String} field 排序字段 支持文件名、文件类型、下载状态、任务添加顺序【默认】
   * @param {String|Compare} method 排序方法 默认升序
   */
  @Mutation
  SORT(payload?: {
    field?: Extract<keyof ITask, 'state' | 'id' | 'name' | 'type'>
    method?: 'ASC' | 'DES' | Compare
  }) {
    payload || (payload = {})
    const field = payload.field || 'id'
    let method = payload.method as Compare
    !method || (method as any) === 'ASC'
      ? (method = ASC)
      : (method as any) === 'DES' && (method = DES)

    this.tasks = sort(
      this.tasks.slice(),
      field === 'id'
        ? (t1, t2) => method(+t1.id.substring(1), +t2.id.substring(1))
        : (t1, t2) => method(t1[field], t2[field])
    )
  }

  /// Action ///
}
