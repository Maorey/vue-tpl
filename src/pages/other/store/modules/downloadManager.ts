/** see: https://championswimmer.in/vuex-module-decorators
 * @Description: 下载管理
 * @Author: 毛瑞
 * @Date: 2020-02-11 14:43:12
 */
import {
  VuexModule,
  Module,
  getModule,
  Mutation,
  Action,
} from 'vuex-module-decorators'
import Message from 'element-ui/lib/message'
// ↑因scss注入问题，应在合适的地方引入组件对应的scss，比如页面入口
import { free } from '@/utils/downloader'
import getKey from '@/utils/getKey'
import { PREFER, hook } from './prefer'
import store from '..'

export const enum STATE {
  /** 初始化 */
  init = '',
  /** 等待下载 */
  wait = 'a',
  /** 下载中 */
  download = 'b',
  /** 已暂停 */
  pause = 'c',
  /** 下载成功 */
  success = 'd',
  /** 下载失败 */
  failed = 'e',
  /** 已保存 */
  saved = 'f',
}
export interface IParams {
  /** 文件名 */
  name: string
  /** 下载地址 */
  url: string
  /** 查询参数 */
  query?: IObject
}
/** 下载任务
 */
export interface ITask extends IParams {
  /** 任务id */
  id: string
  /** 当前状态 */
  state: STATE
}
/** 下载管理 */
export interface IDownloadManager {
  /** 下载配置 */
  config: typeof PREFER.download.config
  /** 任务列表 */
  tasks: ITask[]
  /** 等待下载数量 */
  wait: number
  /** 下载中数量 */
  download: number
  /** 已暂停数量 */
  pause: number
  /** 下载成功数量 */
  success: number
  /** 下载失败数量 */
  failed: number
  /** 下载进度(-1表示无任务) [0, 100]向下取整 下载成功/(下载成功 + 下载中 + 等待下载) */
  progress: number
}

/** 下载管理本地信息 */
const DOWNLOAD =
  PREFER.download ||
  (PREFER.download = {
    config: { max: 3, queue: 10, alive: 30 * 1000 },
    tasks: [],
  })
// ObjectURL 缓存
const CACHE: IObject<string> = {}
/** 状态与stroke键映射 */
const MAP_KEY: { [key in STATE]?: string } = {
  [STATE.wait]: 'wait',
  [STATE.download]: 'download',
  [STATE.pause]: 'pause',
  [STATE.success]: 'success',
  [STATE.failed]: 'failed',
}

/** 下载管理
 */
@Module({ dynamic: true, namespaced: true, name: 'downloadManager', store })
class DownloadManager extends VuexModule implements IDownloadManager {
  /// State & Getter(public) ///
  config = DOWNLOAD.config
  tasks: ITask[] = []
  wait = 0
  download = 0
  pause = 0
  success = 0
  failed = 0
  progress = -1

  constructor(module: DownloadManager) {
    super(module)
    // 初始化恢复下载
    const tasks = DOWNLOAD.tasks as ITask[]
    this.tasks = tasks
    if (tasks.length) {
      const state = DOWNLOAD.config.auto ? STATE.download : STATE.pause
      for (const task of tasks) {
        task.state = STATE.init
        task.id = getKey('t')
        this.setState(task, state)
      }
    }
  }

  private updateProgress() {
    const denominator = this.success + this.download + this.wait
    this.progress = denominator ? ((100 * this.success) / denominator) | 0 : -1
  }

  /// Mutation 无法调用/commit 必须通过Action ///
  @Mutation
  protected CONFIG(config: IDownloadManager['config']) {
    Object.assign(DOWNLOAD.config, config)
    this.config = DOWNLOAD.config
  }

  @Mutation
  protected ADD_TASK(task: IParams) {
    const tasks = this.tasks
    let isSame
    let item: ITask
    for (item of tasks) {
      // diff任务是否已存在
      if (task.name === item.name && task.url === item.url) {
        if (task.query !== item.query) {
          if ((isSame = task.query && item.query)) {
            // 查询参数只考虑一级
            for (const key in task.query) {
              if (task.query[key] !== (item.query as IObject)[key]) {
                isSame = false
              }
            }
          }

          if (!isSame) {
            continue
          }
        }

        Message.warning(`下载任务【${item.name}】已存在`)
        return item.id
      }
    }

    item = task as ITask
    item.id = getKey('t')
    item.state = STATE.init
    tasks.push(item)
    this.STATE(item)
    return item.id
  }

  @Mutation
  protected RM_TASK(task: ITask | number | string) {
    const tasks = this.tasks
    let id: any
    let index: number | undefined
    switch (typeof task) {
      case 'number':
        if (!(task = tasks[(index = task)])) {
          return
        }
        id = task.id
        break
      case 'string':
        id = task
        if ((index = tasks.findIndex(item => id === (task = item).id)) === -1) {
          return
        }
        break
      default:
        id = task.id
        if ((index = tasks.findIndex(item => id === item.id)) === -1) {
          return
        }
    }
    tasks.splice(index, 1) // 移除任务
    if ((id = CACHE[id])) {
      // 释放文件
      free(id.href)
      delete CACHE[id]
    }
    // 更新数据
    ;(id = MAP_KEY[(task as ITask).state]) &&
      (this as any)[id] &&
      (this as any)[id]--
    this.updateProgress()
  }

  /// Mutation 无法调用/commit 必须通过Action ///
  @Mutation
  protected STATE(task: ITask | number | string, state?: STATE) {
    const tasks = this.tasks
    switch (typeof task) {
      case 'number':
        if (!(task = tasks[task])) {
          return
        }
        break
      case 'string':
        if ((task = tasks.findIndex(item => item.id === task)) === -1) {
          return
        }
        break
    }

    const TASK = task as ITask
    if (state) {
      // 设置状态
      switch (state) {
        case STATE.wait:
          // 暂停
          break
        case STATE.download:
          // 下载
          break
      }
      return
    }

    // 自动设置状态
    switch (TASK.state) {
      case STATE.wait:
        // 插队下载
        break
      case STATE.download:
        // 暂停
        break
      case STATE.pause:
        // 继续
        break
      case STATE.success:
        // 保存
        break
      case STATE.failed:
        // 重新下载
        break
      // case STATE.saved:
      //   break
    }
  }

  /// Action ///
  /** 更新设置
   * @param {IDownloadManager['config']} config 设置
   */
  @Action
  configure(config: IDownloadManager['config']) {
    // this.context.commit('DYNAMIC', dynamic) // 非动态模块
    this.CONFIG(config) // 动态模块
  }

  /** 添加任务
   * @param {IParams} 任务信息
   *
   * @returns {string} 任务id
   */
  @Action
  addTask(task: IParams) {
    return this.ADD_TASK(task)
  }

  /** 批量添加任务
   * @param {IParams[]} 任务信息数组
   *
   * @returns {string[]} 对应任务id数组
   */
  @Action
  addTasks(tasks: IParams[]) {
    const ids: string[] = []
    for (const task of tasks) {
      ids.push(this.ADD_TASK(task))
    }
    return ids
  }

  /** 移除任务
   * @param {task|number|string} 任务对象/索引/id
   */
  @Action
  removeTask(task: ITask | number | string) {
    this.RM_TASK(task)
  }

  /** 批量移除任务 (不传参数则移除全部任务)
   * @param {(task|number|string)[]} [可选]任务对象/索引/id数组
   */
  @Action
  removeTasks(tasks?: (ITask | number | string)[]) {
    tasks || (tasks = this.tasks)
    for (const task of tasks) {
      this.RM_TASK(task)
    }
  }

  /** 修改任务状态, 未设置状态则自动根据当前任务状态设置
   * @param {task|number|string} 任务对象/索引/id
   * @param {STATE} state [可选]设置任务状态
   */
  @Action
  setState(task: ITask | number | string, state?: STATE) {
    this.STATE(task, state)
  }

  /** 批量修改任务状态, 未设置状态则自动根据当前任务状态设置
   * @param {(task|number|string)[]} 任务对象/索引/id数组
   * @param {STATE} state [可选]设置任务状态
   */
  @Action
  setStates(tasks: (ITask | number | string)[], state?: STATE) {
    for (const task of tasks) {
      this.STATE(task, state)
    }
  }
}

hook(() => {
  const tasks = DOWNLOAD.tasks as ITask[] // 不保留已保存的任务

  for (let i = 0, len = tasks.length, task; i < len; i++) {
    task = tasks[i]
    if (task.state === STATE.saved) {
      tasks.splice(i--, 1)
      len--
    } else {
      delete task.id
      delete task.state
    }
  }
})

export default getModule(DownloadManager)
